window.aCompas.audioEngine = {
    isInitialized: false,
    audioContext: null,
    audioFormat: null,
    timerWorker: null,
    lookahead: 30,
    // Lazy-initializes the audio engine
    initialize: function() {
        if (! this.isInitialized) {
            try {
                // Create Web Audio API audio context
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                if (window.AudioContext != undefined) {
                    this.audioContext = new AudioContext();
                    // Detect the audio format to use for playing
                    if (new Audio().canPlayType("audio/flac")) {
                        this.audioFormat = "flac";
                    } else if (new Audio().canPlayType("audio/ogg")) {
                        this.audioFormat = "ogg";
                    } else if (new Audio().canPlayType("audio/mpeg")) {
                        this.audioFormat = "mp3";
                    } else if (new Audio().canPlayType("audio/mp4")) {
                        this.audioFormat = "mp4";
                    } else if (new Audio().canPlayType("audio/wav")) {
                        this.audioFormat = "wav";
                    } else {
                        throw new Error("None of the available audio formats can be played");
                    }
                    // Load sounds
                    this.loadSounds();
                    // Set the message worker
                    this.timerWorker = new Worker("/metronomeWorker.js");
                    this.timerWorker.onmessage = function(e) {
                        if (e.data === "tick") {
                            // console.log("tick!");
                            scheduler();
                        } else {
                            console.log("message: " + e.data);
                        }
                    };
                    this.timerWorker.postMessage({"interval": this.lookahead});
                    this.isInitialized = true;
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
    loadSounds: function() {
        var audioEngine = this;
        $(window.aCompas.instruments).each(function(instrumentIndex, instrument) {
            var instrumentSounds = window.aCompas.sounds[instrument.slug];
            $(instrumentSounds).each(function(soundIndex, soundData) {
                audioEngine.loadSound(instrument.slug, soundData.filenamePart, soundData);
            });
        });
    },
    // Loads and decodes a sound
    loadSound: function(instrumentSlug, filenamePart, soundObj) {
        var audioEngine = this;
        var request = new XMLHttpRequest();
        var audioFilePath = "/audio/" + instrumentSlug + "/" + instrumentSlug
            + "_" + filenamePart + "." + this.audioFormat;
        request.open('GET', audioFilePath, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            // request.response is encoded... so decode it now
            audioEngine.audioContext.decodeAudioData(request.response, function(buffer) {
                // Store the buffer in the right object in window.aCompas.sounds
                soundObj.buffer = buffer;
                }, function() {
                    throw new Meteor.Error("Failed to decode audio file with path \""
                        + audioFilePath + "\" !");
                });
        };
        request.send();
    }
};
