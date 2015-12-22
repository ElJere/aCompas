window.aCompas.audioEngine = {
    _isInitialized: false,
    _audioContext: null,
    _audioFormat: null,
    _timerWorker: null,
    _lookahead: 30,
    _masterGainNode: null,
    // Lazy-initializes the audio engine
    initialize: function() {
        var audioEngine = this;
        if (! audioEngine._isInitialized) {
            try {
                // Create Web Audio API audio context
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                if (window.AudioContext != undefined) {
                    audioEngine._audioContext = new AudioContext();
                    // Detect the audio format to use for playing
                    if (new Audio().canPlayType("audio/flac")) {
                        audioEngine._audioFormat = "flac";
                    } else if (new Audio().canPlayType("audio/ogg")) {
                        audioEngine._audioFormat = "ogg";
                    } else if (new Audio().canPlayType("audio/mpeg")) {
                        audioEngine._audioFormat = "mp3";
                    } else if (new Audio().canPlayType("audio/mp4")) {
                        audioEngine._audioFormat = "mp4";
                    } else if (new Audio().canPlayType("audio/wav")) {
                        audioEngine._audioFormat = "wav";
                    } else {
                        throw new Error("None of the available audio formats can be played");
                    }
                    // Load sounds
                    audioEngine._loadSounds();
                    // Set the message worker
                    audioEngine._timerWorker = new Worker("/js/metronomeWorker.js");
                    audioEngine._timerWorker.onmessage = function(e) {
                        if (e.data === "tick") {
                            // console.log("tick!");
                            audioEngine._scheduler();
                        } else {
                            console.log("message: " + e.data);
                        }
                    };
                    audioEngine._timerWorker.postMessage({"interval": audioEngine._lookahead});
                    // Initialize _masterGainNode
                    audioEngine._masterGainNode = audioEngine._audioContext.createGain();
                    audioEngine._masterGainNode.connect(audioEngine._audioContext.destination);
                    audioEngine._isInitialized = true;
                } else {
                    console.error("The Web Audio API is not supported by the web browser you are using !");
                    $("#will-not-work-modal").openModal();
                }
            } catch (e) {
                console.error(e);
                $("#will-not-work-modal").openModal();
            }
        }
    },
    // Loads all the available sounds
    _loadSounds: function() {
        var audioEngine = this;
        $(window.aCompas.instruments).each(function(instrumentIndex, instrument) {
            var instrumentSounds = window.aCompas.sounds[instrument.slug];
            $(instrumentSounds).each(function(soundIndex, soundData) {
                audioEngine._loadSound(instrument.slug, soundData.filenamePart, soundData);
            });
        });
    },
    // Loads and decodes a sound
    _loadSound: function(instrumentSlug, filenamePart, soundObj) {
        var audioEngine = this;
        var request = new XMLHttpRequest();
        var audioFilePath = "/audio/" + instrumentSlug + "/" + filenamePart
            + "." + audioEngine._audioFormat;
        request.open('GET', audioFilePath, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            // request.response is encoded... so decode it now
            audioEngine._audioContext.decodeAudioData(request.response, function(buffer) {
                // Store the buffer in the right object in window.aCompas.sounds
                soundObj.buffer = buffer;
                }, function() {
                    throw new Meteor.Error("Failed to decode audio file with path \""
                        + audioFilePath + "\" !");
                });
        };
        request.send();
    },
    // Tempo (BPM)
    _tempo: null,
    setTempo: function(tempo) {
        var audioEngine = this;
        audioEngine._tempo = tempo;
    },
    // Resolution. True for eighth-notes, false for quarter-notes only.
    _resolution: true,
    setResolution: function(resolution) {
        var audioEngine = this;
        audioEngine._resolution = resolution;
    },
    // Is click enabled ?
    _clickEnabled: false,
    setClickEnabled: function(clickEnabled) {
        var audioEngine = this;
        audioEngine._clickEnabled = clickEnabled;
    },
    // Volume (%)
    setVolume: function(volume) {
        var audioEngine = this;
        audioEngine._masterGainNode.gain.value = volume / 100.0;
    },
    // loop.definition for the loop currently being played
    _loopDefinition: null,
    setLoopDefinition: function(loopDefinition) {
        var audioEngine = this;
        audioEngine._loopDefinition = loopDefinition;
    },
    // Are we currently playing ?
    _isPlaying: false,
    // Plays if not already playing, pauses if already playing.
    playPause: function() {
        var audioEngine = this;
        if (audioEngine._isPlaying) {
            audioEngine._isPlaying = false;
            audioEngine._currentNote = 0;
            audioEngine._timerWorker.postMessage("stop");
        } else {
            audioEngine._isPlaying = true;
            audioEngine._nextNoteTime = audioEngine._audioContext.currentTime;
            audioEngine._timerWorker.postMessage("start");
        }
    },
    getIsPlaying() {
        var audioEngine = this;
        return audioEngine._isPlaying;
    },
    // When the next note is due ?
    _nextNoteTime: 0.0,
    // How far ahead to schedule audio ? (seconds)
    _scheduleAheadTime: 0.3,
    // Which note is currently the last scheduled note ? (index)
    _currentNote: 0,
    _scheduler: function() {
        var audioEngine = this;
        // While there are notes that will need to play before the next worker interval,
        // schedule them and advance the pointer.
        while (audioEngine._nextNoteTime < audioEngine._audioContext.currentTime + audioEngine._scheduleAheadTime) {
            audioEngine._scheduleNote(audioEngine._currentNote, audioEngine._nextNoteTime);
            audioEngine._nextNote();
        }
    },
    _nextNote: function() {
        var audioEngine = this;
        // Calculate the duration of a quarter-note (in seconds)
        var quarterNoteDuration = 60.0 / audioEngine._tempo;
        var eighthNoteDuration = quarterNoteDuration / 2.0;
        audioEngine._nextNoteTime += eighthNoteDuration;
        // Advance the current note, going back to zero when the loop is finished
        audioEngine._currentNote++;
        if (audioEngine._currentNote === audioEngine._loopDefinition.rhythmicStructure.length * 2) {
            audioEngine._currentNote = 0;
        }
    },
    _scheduleNote: function(eighthNoteIndex, time) {
        var audioEngine = this;
        // Don't schedule anything if the browser is lagging too much
        var maximumLag = 1; // Seconds
        if (audioEngine._audioContext.currentTime - time > maximumLag) {
            return ;
        }
        // If resolution is set to quarter-notes only, don't schedule eighth-notes.
        if ( (audioEngine._resolution === false) && (eighthNoteIndex % 2 === 1) ) {
            return;
        }
        // Schedule instruments
        audioEngine._scheduleInstrument("palma-clara", eighthNoteIndex, time);
        audioEngine._scheduleInstrument("palma-sorda", eighthNoteIndex, time);
        audioEngine._scheduleInstrument("cajon", eighthNoteIndex, time);
        audioEngine._scheduleInstrument("udu", eighthNoteIndex, time);
//TODO
//audioEngine._scheduleJaleo(eighthNoteIndex, time);
        audioEngine._scheduleClick(eighthNoteIndex, time);
    },
    _scheduleInstrument: function(instrumentSlug, eighthNoteIndex, time) {
        var audioEngine = this;
        for (var soundId in audioEngine._loopDefinition.soundOccurrences[instrumentSlug]) {
            if (audioEngine._loopDefinition.soundOccurrences[instrumentSlug].hasOwnProperty(soundId)) {
                if (audioEngine._loopDefinition.soundOccurrences[instrumentSlug][soundId][eighthNoteIndex]) {
                    audioEngine._playSoundAtTime(instrumentSlug, soundId, time);
                }
            }
        }
    },
    _scheduleClick: function(eighthNoteIndex, time) {
        var audioEngine = this;
        if (! audioEngine._clickEnabled || eighthNoteIndex % 2 === 1) {
            return ;
        }
        if (audioEngine._loopDefinition.rhythmicStructure[eighthNoteIndex / 2].isStrong) {
            audioEngine._playSoundAtTime("click", 1, time);
        } else {
            audioEngine._playSoundAtTime("click", 2, time);
        }
    },
    // Plays a sound at a given time
    // Note 1 : the "whichSound" parameter can be an id (string) or an integer (position)
    _playSoundAtTime: function(instrumentSlug, whichSound, time) {
        var audioEngine = this;
        var soundData = null;
        // Fetch sound data for the sound to be played
        if (typeof(whichSound) === "string") {
            $(window.aCompas.sounds[instrumentSlug]).each(function(soundIndex, soundData2) {
                if (soundData2.id === whichSound) {
                    soundData = soundData2;
                }
            });
        } else {
            $(window.aCompas.sounds[instrumentSlug]).each(function(soundIndex, soundData2) {
                if (soundData2.position === whichSound) {
                    soundData = soundData2;
                }
            });
        }
        // Create a gainNode
        var gainNode = audioEngine._audioContext.createGain();
        // Set gain values
        gainNode.gain.value = soundData.volume;
        // Create bufferSource
        var bufferSource = audioEngine._audioContext.createBufferSource();
        bufferSource.buffer = soundData.buffer;
        // Connect everything
        bufferSource.connect(gainNode);
        gainNode.connect(audioEngine._masterGainNode);
        // Play
        bufferSource.start(time);
    }
};
