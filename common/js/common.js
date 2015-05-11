// Initialize the metronome object
window.aCompas = {
    audioContext: null,
    isPlaying: false,               // Are we currently playing ?
    currentNote: null,              // What note is currently last scheduled ?
    defaultPaloSlug: "tangos",      // Slug of the default palo
    palo: null,                     // Current palo's slug
    masterVolume: 90,               // Default master volume
    lookahead: 25.0,                // How frequently to call scheduling function ?
                                    // (in milliseconds)
    scheduleAheadTime: 0.1,         // How far ahead to schedule audio (sec)
                                    // This is calculated from lookahead, and overlaps
                                    // with next interval (in case the timer is late)
    nextNoteTime: 0.0,              // When the next note is due ?
    noteResolution: 0,              // 0 = times + counter times, 1 = times only
    clara: true,                    // Is the palma clara track on ?
    sorda: true,                    // Is the palma sorda track on ?
    cajon: true,                    // Is the cajón track on ?
    udu: true,                      // Is the udu track on ?
    click: false,                   // Is the click track on ?
    improvise: true,                // Is improvisation mode on ?
    timerWorker: null,              // The Web Worker used to fire timer messages
    nbBeatsInPattern: null,         // Number of beats in the current pattern (counting eighth notes)
    visualization: null,            // <svg> visualization
    paper: null,                    // raphael.js constructor returns a paper object
                                    // used to manipulate the SVG visualization
    palos: null,                    // Palos data
    deviceOrientation: null,        // String ("Landscape" or "Portrait")
    playStartTime: null,            // The time when the user starts playing is stored
                                    // in this property
    audioFormat: null,              // Audio format to use for playing
    sounds: {                       // Sounds used by the application
        clara_1: {
            src: 'clara_1',
            volume : 1
        },
        clara_2: {
            src: 'clara_2',
            volume : 1
        },
        clara_3: {
            src: 'clara_3',
            volume : 0.5
        },
        sorda_1: {
            src: 'sorda_1',
            volume : 0.8
        },
        sorda_2: {
            src: 'sorda_2',
            volume : 0.2
        },
        cajon_1: {
            src: 'cajon_1',
            volume: 0.6
        },
        cajon_2: {
            src: 'cajon_2',
            volume: 0.6
        },
        cajon_3: {
            src: 'cajon_3',
            volume: 0.6
        },
        udu_1: {
            src: 'udu_1',
            volume : 1
        },
        udu_2: {
            src: 'udu_2',
            volume : 0.5
        },
        click_1: {
            src: 'click_1',
            volume: 0.1
        },
        click_2: {
            src: 'click_2',
            volume: 0.1
        }
    },
    soundCounts: {
        clara: 3,
        sorda: 2,
        cajon: 3,
        udu: 2
    }
}

// Palos data
//
// Tempo = number of quarter notes per minute
// Nb beats in pattern : number of beats in a pattern (counting an eighth note as a beat)
// Nb cells in a pattern : number of times the palo's basic rhythmic cell is repeated in the pattern
window.aCompas.palos = [
    {
        slug: "buleria-6",
        label: "Buleria (6)",
        minTempo: 40,
        maxTempo: 340,
        defaultTempo: 200,
        nbBeatsInPattern: 12,
        clara: {
            1: 3,
            2: 2,
            3: 3,
            4: 3,
            6: 1,
            7: 3,
            8: 3,
            10: 3
        },
        sorda: {
            0: { nb: 2, volume: 0.3 },
            1: { nb: 2, volume: 0.3 },
            2: 2,
            3: { nb: 2, volume: 0.3 },
            4: { nb: 2, volume: 0.3 },
            6: 1,
            7: { nb: 2, volume: 0.3 },
            8: { nb: 2, volume: 0.3 },
            10: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 3,
            1: 2,
            2: 1,
            3: 1,
            4: 2,
            6: 1,
            8: 2,
            10: 2
        },
        udu: {
            0: 1,
            3: 2,
            6: 1,
            9: 2
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "strong",
            7: "down",
            8: "up",
            9: "down",
            10: "up",
            11: "down"
        },
        beatLabels: {
            0: 6,
            2: 1,
            4: 2,
            6: 3,
            8: 4,
            10: 5
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 270 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo <= 100 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "buleria-12",
        label: "Buleria (12)",
        minTempo: 30,
        maxTempo: 340,
        defaultTempo: 200,
        nbBeatsInPattern: 24,
        clara: {
            0: 1,
            2: 3,
            3: 2,
            4: 3,
            6: 1,
            8: 3,
            9: 2,
            10: 3,
            12: 3,
            14: 1,
            15: 2,
            16: 1,
            18: 3,
            19: 2,
            20: 1,
            22: 3
        },
        sorda: {
            0: 1,
            2: 2,
            4: 2,
            6: 1,
            8: 2,
            10: 2,
            12: 2,
            14: 1,
            15: 2,
            16: 1,
            18: 2,
            19: 1,
            20: 2,
            22: 2
        },
        cajon: {
            0: 3,
            1: 2,
            2: 1,
            3: 1,
            4: 2,
            6: 3,
            8: 2,
            9: 1,
            10: 3,
            12: 2,
            14: 2,
            15: 1,
            16: 3,
            18: 2,
            19: 1,
            20: 3,
            22: 2
        },
        udu: {
            0: 1,
            3: 2,
            6: 1,
            9: 2,
            14: 1,
            15: 2,
            16: 1,
            19: 2,
            20: 1
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "strong",
            7: "down",
            8: "up",
            9: "down",
            10: "up",
            11: "down",
            12: "up",
            13: "down",
            14: "strong",
            15: "down",
            16: "strong",
            17: "down",
            18: "up",
            19: "down",
            20: "strong",
            21: "down",
            22: "up",
            23: "down"
        },
        beatLabels: {
            0: 12,
            2: 1,
            4: 2,
            6: 3,
            8: 4,
            10: 5,
            12: 6,
            14: 7,
            16: 8,
            18: 9,
            20: 10,
            22: 11
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 230 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo >= 1200 && tempo <= 180 ) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if ( tempo <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "fandangos",
        label: "Fandangos",
        minTempo: 30,
        maxTempo: 270,
        defaultTempo: 150,
        nbBeatsInPattern: 24,
        clara: {
            0: 1,
            1: 2,
            2: 3,
            3: 2,
            4: 3,
            6: 1,
            7: 2,
            8: 3,
            10: 3,
            12: 1,
            13: 2,
            14: 3,
            15: 2,
            16: 3,
            18: 1,
            19: 2,
            20: 1,
            22: 3
        },
        sorda: {
            0: 1,
            1: 2,
            2: { nb: 2, volume: 0.3 },
            3: 2,
            4: { nb: 2, volume: 0.3 },
            6: 1,
            7: 2,
            8: { nb: 2, volume: 0.3 },
            10: { nb: 2, volume: 0.3 },
            12: 1,
            13: 2,
            14: { nb: 2, volume: 0.3 },
            15: 2,
            16: { nb: 2, volume: 0.3 },
            18: 1,
            19: 2,
            20: 1,
            22: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 1,
            1: 2,
            2: 3,
            3: 2,
            4: 3,
            6: 1,
            7: 2,
            8: 3,
            10: 3,
            12: 1,
            13: 2,
            14: 3,
            15: 2,
            16: 2,
            18: 1,
            19: 2,
            20: 1,
            22: 2
        },
        udu: {
            0: 1,
            3: 2,
            6: 1,
            12: 1,
            15: 2,
            18: 1,
            20: 1
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "strong",
            7: "down",
            8: "up",
            9: "down",
            10: "up",
            11: "down",
            12: "strong",
            13: "down",
            14: "up",
            15: "down",
            16: "up",
            17: "down",
            18: "strong",
            19: "down",
            20: "strong",
            21: "down",
            22: "up",
            23: "down"
        },
        beatLabels: {
            0: 1,
            2: 2,
            4: 3,
            6: 4,
            8: 5,
            10: 6,
            12: 7,
            14: 8,
            16: 9,
            18: 10,
            20: 11,
            22: 12
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 200 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo <= 80 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "rumba",
        label: "Rumba",
        minTempo: 30,
        maxTempo: 340,
        defaultTempo: 200,
        nbBeatsInPattern: 16,
        clara: {
            0: 1,
            1: 1,
            2: 3,
            3: 2,
            4: 1,
            6: 2,
            8: 1,
            9: 1,
            10: 3,
            11: 2,
            12: 1,
            14: 2
        },
        sorda: {
            0: 1,
            1: 1,
            2: { nb: 2, volume: 0.3 },
            3: { nb: 2, volume: 0.3 },
            4: 1,
            6: { nb: 2, volume: 0.3 },
            8: 1,
            9: 1,
            10: { nb: 2, volume: 0.3 },
            11: { nb: 2, volume: 0.3 },
            12: 1,
            14: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 3,
            1: 2,
            2: 1,
            3: 3,
            5: 3,
            6: 1,
            8: 3,
            9: 2,
            10: 1,
            11: 3,
            13: 3,
            14: 1
        },
        udu: {
            0: 1,
            1: 2,
            4: 1,
            5: 2,
            8: 1,
            9: 2,
            12: 1
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "up",
            7: "down",
            8: "strong",
            9: "down",
            10: "up",
            11: "down",
            12: "up",
            13: "down",
            14: "up",
            15: "down"
        },
        beatLabels: {
            0: 1,
            2: 2,
            4: 3,
            6: 4,
            8: 5,
            10: 6,
            12: 7,
            14: 8
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 240 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo <= 90 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "siguiriya",
        label: "Siguiriya",
        minTempo: 20,
        maxTempo: 180,
        defaultTempo: 80,
        nbBeatsInPattern: 24,
        clara: {
            0: 1,
            1: 3,
            2: 2,
            4: 1,
            5: 3,
            6: 2,
            7: 2,
            8: 1,
            9: 3,
            10: 3,
            11: 1,
            12: 3,
            13: 2,
            14: 1,
            15: 3,
            16: 3,
            17: 1,
            18: 3,
            19: 2,
            20: 1,
            22: 3
        },
        sorda: {
            0: 1,
            1: { nb: 2, volume: 0.3 },
            2: 2,
            3: { nb: 2, volume: 0.3 },
            4: 1,
            5: { nb: 2, volume: 0.3 },
            6: 2,
            7: { nb: 2, volume: 0.3 },
            8: 1,
            9: { nb: 2, volume: 0.3 },
            10: { nb: 2, volume: 0.3 },
            11: 2,
            12: { nb: 2, volume: 0.3 },
            13: { nb: 2, volume: 0.3 },
            14: 1,
            15: { nb: 2, volume: 0.3 },
            16: { nb: 2, volume: 0.3 },
            17: 2,
            18: { nb: 2, volume: 0.3 },
            19: { nb: 2, volume: 0.3 },
            20: 1,
            22: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 1,
            1: 2,
            2: 3,
            4: 1,
            5: 2,
            6: 3,
            8: 1,
            9: 2,
            10: 3,
            11: 2,
            14: 1,
            15: 2,
            16: 3,
            17: 2,
            20: 1,
            21: 2,
            22: 3
        },
        udu: {
            0: 1,
            3: 2,
            4: 1,
            7: 2,
            8: 1,
            11: 2,
            14: 1,
            17: 2,
            20: 1
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "strong",
            5: "down",
            6: "up",
            7: "down",
            8: "strong",
            9: "down",
            10: "up",
            11: "down",
            12: "up",
            13: "down",
            14: "strong",
            15: "down",
            16: "up",
            17: "down",
            18: "up",
            19: "down",
            20: "strong",
            21: "down",
            22: "up",
            23: "down"
        },
        beatLabels: {
            0: 1,
            4: 2,
            8: 3,
            14: 4,
            20: 5
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 160 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "solea",
        label: "Soleá",
        minTempo: 50,
        maxTempo: 260,
        defaultTempo: 100,
        nbBeatsInPattern: 24,
        clara: {
            0: 1,
            2: 3,
            3: 2,
            4: 3,
            6: 1,
            8: 3,
            9: 2,
            10: 3,
            12: 1,
            14: 3,
            15: 2,
            16: 1,
            18: 3,
            19: 2,
            20: 1,
            22: 3
        },
        sorda: {
            0: 1,
            2: { nb: 2, volume: 0.3 },
            3: 2,
            4: { nb: 2, volume: 0.3 },
            6: 1,
            8: { nb: 2, volume: 0.3 },
            9: 2,
            10: 2,
            12: 1,
            14: { nb: 2, volume: 0.3 },
            15: 2,
            16: 1,
            18: { nb: 2, volume: 0.3 },
            19: 2,
            20: 1,
            22: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 1,
            1: 2,
            2: 3,
            3: 2,
            4: 3,
            6: 1,
            7: 2,
            8: 3,
            9: 2,
            10: 3,
            12: 1,
            13: 2,
            14: 3,
            16: 1,
            17: 2,
            18: 3,
            20: 1,
            21: 2,
            22: 3
        },
        udu: {
            0: 1,
            6: 1,
            12: 1,
            16: 1,
            20: 1
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "strong",
            7: "down",
            8: "up",
            9: "down",
            10: "up",
            11: "down",
            12: "strong",
            13: "down",
            14: "up",
            15: "down",
            16: "strong",
            17: "down",
            18: "up",
            19: "down",
            20: "strong",
            21: "down",
            22: "up",
            23: "down"
        },
        beatLabels: {
            0: 12,
            2: 1,
            4: 2,
            6: 3,
            8: 4,
            10: 5,
            12: 6,
            14: 7,
            16: 8,
            18: 9,
            20: 10,
            22: 11
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 180 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( tempo >= 120 && tempo <= 180 ) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if ( tempo <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "tangos",
        label: "Tangos",
        minTempo: 30,
        maxTempo: 340,
        defaultTempo: 170,
        nbBeatsInPattern: 16,
        clara: {
            0: 3,
            1: 3,
            2: 2,
            3: 2,
            4: 3,
            6: 1,
            8: 3,
            9: 3,
            10: 1,
            11: 3,
            12: 2,
            14: 1
        },
        sorda: {
            0: { nb: 2, volume: 0.3 },
            1: { nb: 2, volume: 0.3 },
            2: 1,
            3: 2,
            4: { nb: 2, volume: 0.3 },
            6: 1,
            8: { nb: 2, volume: 0.3 },
            9: { nb: 2, volume: 0.3 },
            10: 1,
            11: { nb: 2, volume: 0.3 },
            12: 1,
            14: { nb: 2, volume: 0.3 }
        },
        cajon: {
            0: 3,
            1: 2,
            2: 1,
            3: 3,
            5: 3,
            6: 1,
            8: 3,
            9: 2,
            10: 1,
            11: 3,
            13: 3,
            14: 1
        },
        udu: {
            0: 1,
            3: 2,
            8: 1,
            11: 2
        },
        beats: {
            0: "strong",
            1: "down",
            2: "up",
            3: "down",
            4: "up",
            5: "down",
            6: "up",
            7: "down",
            8: "strong",
            9: "down",
            10: "up",
            11: "down",
            12: "up",
            13: "down",
            14: "up",
            15: "down"
        },
        beatLabels: {
            0: 1,
            2: 2,
            4: 3,
            6: 4,
            8: 5,
            10: 6,
            12: 7,
            14: 8
        },
        setTempoInfo: function() {
            var tempo = getTempo();
            if ( tempo >= 180 ) {
                setInfoMessage("Your rhythm is por rumba");
            } else if ( tempo <= 90 ) {
                setInfoMessage("Your rhythm is por tientos");
            } else {
                setInfoMessage(null);
            }
        }
    }
];

// Set functions
function playSound(name, start, vol) {
    // If vol is null, use the sound's default volume
    if (vol === null) {
        vol = window.aCompas.sounds[name].volume;
    }
    // Create source, sounds gain and master gain
    var source = window.aCompas.audioContext.createBufferSource();
    var gainNode = window.aCompas.audioContext.createGain();
    var masterGainNode = window.aCompas.audioContext.createGain();
    // Set sounds and master gain nodes
    gainNode.gain.value = vol;
    masterGainNode.gain.value = window.aCompas.masterVolume / 100;
    source.buffer = window.aCompas.sounds[name].buffer;
    // Connect everything
    source.connect(gainNode);
    gainNode.connect(masterGainNode);
    masterGainNode.connect( window.aCompas.audioContext.destination );
    // Play
    source.start(start);
}

function getTempo() {
    return $("#tempo").data("slider").getValue();
}

function nextNote() {
    // Calculate current beat length
    var secondsPerBeat = 60.0 / getTempo();
    // Add beat length to last beat time
    window.aCompas.nextNoteTime += 0.5 * secondsPerBeat;
    // Advance the beat number, back to zero when loop finished
    window.aCompas.currentNote++;
    if (window.aCompas.currentNote === window.aCompas.nbBeatsInPattern) {
        window.aCompas.currentNote = 0;
    }
}

function scheduleInstrumentWithoutImprovisation(instrument, beatNumber, time, paloData) {
    if (paloData[instrument][beatNumber] !== undefined) {
        var nb = null;
        var volume = null;
        // Check if paloData[instrument][beatNumber] is an object
        if (paloData[instrument][beatNumber] === Object(paloData[instrument][beatNumber])) {
            nb = paloData[instrument][beatNumber].nb;
            volume = paloData[instrument][beatNumber].volume;
        } else {
            nb = paloData[instrument][beatNumber];
        }
        playSound(instrument + "_" + nb, time, volume);
    }
}

function scheduleInstrumentWithImprovisation(instrument, time) {
    // Pick a random sound
    var nb = Math.round(Math.random() * (window.aCompas.soundCounts[instrument] - 1)) + 1;
    // Pick a random volume, using the sound's default volume as a maximum value
    var volume = Math.random() * window.aCompas.sounds[instrument + "_" + nb].volume;
    playSound(instrument + "_" + nb, time, volume);
}

function scheduleInstrument(instrument, beatNumber, time, paloData) {
    if (window.aCompas[instrument]) {
        if (window.aCompas.improvise) {
            var improvisationProbability = 20; // Percentage of chances that the pattern is not followed
            var willStickToPattern = (Math.random() > improvisationProbability / 100);
            if (willStickToPattern) {
                scheduleInstrumentWithoutImprovisation(instrument, beatNumber, time, paloData);
            } else {
                scheduleInstrumentWithImprovisation(instrument, time);
            }
        } else {
            scheduleInstrumentWithoutImprovisation(instrument, beatNumber, time, paloData);
        }
    }
}

function scheduleClick(beatNumber, time, paloData) {
    if (window.aCompas.click && beatNumber % 2 === 0) {
        if (paloData.beats[beatNumber] === "strong") {
            playSound("click_1", time, null);
        } else {
            playSound("click_2", time, null);
        }
    }
}

function scheduleNote( beatNumber, time ) {
    // If option "times only" selected, don't play counter times
    if ( (window.aCompas.noteResolution === 1) && (beatNumber % 2 === 1) ) {
        return; 
    }
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (paloData2.slug === window.aCompas.palo) {
            paloData = paloData2;
        }
    });
    // Schedule instruments
    scheduleInstrument("clara", beatNumber, time, paloData);
    scheduleInstrument("sorda", beatNumber, time, paloData);
    scheduleInstrument("cajon", beatNumber, time, paloData);
    scheduleInstrument("udu", beatNumber, time, paloData);
    scheduleClick(beatNumber, time, paloData);
    // Animate visualization
    if (paloData.beats[beatNumber] === "strong") {
        animateStrongBeat(beatNumber, time);
    } else if (paloData.beats[beatNumber] === "up") {
        animateUpBeat(beatNumber, time);
    } else {
        animateDownBeat(beatNumber, time);
    }
}

function scheduler() {
    // while there are notes that will need to play before the next worker interval,
    // schedule them and advance the pointer.
    while ( window.aCompas.nextNoteTime < window.aCompas.audioContext.currentTime + window.aCompas.scheduleAheadTime ) {
        scheduleNote( window.aCompas.currentNote, window.aCompas.nextNoteTime );
        nextNote();
    }
}

function play() {
    var playButton = $('.play > .glyphicon');
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (window.aCompas.palo === paloData2.slug) {
            paloData = paloData2;
        }
    });
    if (! window.aCompas.isPlaying) {
        window.aCompas.currentNote = 0;
        window.aCompas.nextNoteTime = window.aCompas.audioContext.currentTime;
        window.aCompas.playStartTime = window.aCompas.audioContext.currentTime;
        // change play button
        playButton.removeClass('glyphicon-play').addClass('glyphicon-stop');
        $('.play').addClass('active');
        // Send message to worker
        window.aCompas.timerWorker.postMessage("start");
        window.aCompas.isPlaying = true;
        // Track event in Piwik
        _paq.push(['trackEvent', 'Playing', 'Play', paloData.label]);
    } else {
        // change play button
        playButton.removeClass('glyphicon-stop').addClass('glyphicon-play');
        $('.play').removeClass('active');
        // Send message to worker
        window.aCompas.timerWorker.postMessage("stop");
        window.aCompas.isPlaying = false;
        // Track event in Piwik
        _paq.push(['trackEvent', 'Playing', 'Stop', paloData.label,
            Math.round(window.aCompas.audioContext.currentTime - window.aCompas.playStartTime)]);
    }
}

function drawBarsAndNumbers(bar, number, i) {
    // Draw bars
    var rect = window.aCompas.paper.rect(bar.x, bar.y, bar.width, bar.height);
    rect.attr({ fill: "tomato" });
    rect.node.setAttribute("class", "bar bar_" + i);

    // Draw numbers
    var text = null;
    if ( number !== null ) {
        text = window.aCompas.paper.text((bar.x + bar.width / 2.1), (bar.y + 25), number);
        text.attr({
            "fill": "lightgray",
            "font-size": 16,
            "font-family": "sans-serif",
            "font-weight": "bold"
        });
        text.node.setAttribute("class", "number number_" + i);
    }
    return { rect: rect, text: text };
}

function setStrongBeat(elts) {
    elts.rect.attr("fill", "firebrick");
    elts.rect.attr("stroke", "firebrick");
    elts.text.attr("fill", "black");
}

function setUpOrDownBeat(elts) {
    elts.rect.attr({ stroke: "tomato" });
}

function callAtGivenTime(time, callback) {
    window.setTimeout(callback, Math.round((time - window.aCompas.audioContext.currentTime) * 1000));
}

function animateStrongBeat(i, time) {
    callAtGivenTime(time, function() {
        $('.bar_' + i)
            .velocity({ y: 5, height: [150, 300]}, {duration: 0, easing: "linear"})
            .velocity({ y: 150, height: 5}, {duration: 220, easing: "linear"});
    });
}

function animateUpBeat(i, time) {
    callAtGivenTime(time, function() {
        $('.bar_' + i)
            .velocity({ y: 55, height: [100, 250]}, {duration: 0, easing: "linear"})
            .velocity({ y: 150, height: 5}, {duration: 220, easing: "linear"});
    });
}

function animateDownBeat(i, time) {
    callAtGivenTime(time, function() {
        $('.bar_' + i)
            .velocity({ y: 100, height: [55, 150]}, {duration: 0, easing: "linear"})
            .velocity({ y: 150, height: 5}, {duration: 220, easing: "linear"});
    });
}

function draw() {
    // Take measures
    var x = Math.floor( 1200 / window.aCompas.nbBeatsInPattern );
    var y = x - Math.floor( 1200 / (window.aCompas.nbBeatsInPattern + 1) );
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (paloData2.slug === window.aCompas.palo) {
            paloData = paloData2;
        }
    });
    // Draw svg
    for ( var i = 0; i < window.aCompas.nbBeatsInPattern; i++ ) {
        var bar = {
            'x': (x * i + y) - y / 2,
            'y': 150,
            'width': x - y,
            'height': 5
        };
        var beatLabel = null;
        if (paloData.beatLabels[i] !== undefined) {
            beatLabel = paloData.beatLabels[i];
        }
        var elts = drawBarsAndNumbers(bar, beatLabel, i);
        if (paloData.beats[i] === "strong") {
            setStrongBeat(elts);
        } else {
            setUpOrDownBeat(elts);
        }
    }
}

function resetDraw() {
    // Erase svg and draw again
    window.aCompas.paper.clear();
    draw();
}

function setInfoMessage(txt) {
    var txtDiv = $("#info");
    if (txt === null) {
        txtDiv.css({ "opacity": 0 }, 300).empty();
    } else {
        if (txtDiv.html().length !== 0 ) {
            txtDiv.html(txt);
        } else {
            txtDiv.html(txt).animate({"opacity": 1}, 300);
        }
    }
}

function setPalo(paloSlug) {
    // Stop playing if needed
    if (window.aCompas.isPlaying) {
        play();
    }
    window.aCompas.palo = paloSlug;
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (window.aCompas.palo === paloData2.slug) {
            paloData = paloData2;
        }
    });
    // Update window.aCompas.nbBeatsInPattern
     window.aCompas.nbBeatsInPattern = paloData.nbBeatsInPattern;
    // Destroy the tempo slider if needed
    if ($("#tempo").data("slider")) {
        $("#tempo").data("slider").destroy();
    }
    // Build tempo slider
    $("#tempo").slider({
        orientation: "vertical",
        min: paloData.minTempo,
        max: paloData.maxTempo,
        tooltip: "hide",
        value: paloData.defaultTempo,
        reversed: true
    }).on("slide", function(e) {
        $("#tempo-label").html("Tempo: " + getTempo() + " bpm");
        paloData.setTempoInfo();
    }).on("slideStop", function(e) {
        $("#tempo-label").html("Tempo: " + getTempo() + " bpm");
        paloData.setTempoInfo();
    });
    // Force rendering of the slider's label
    $("#tempo").trigger("slideStop");
    // Reset visualization
    resetDraw();
}

function adaptToFooterHeight() {
    var footer = $("footer");
    if (footer.length > 0) {
        var mainPaddingBottom = footer.height() + parseInt(footer.css("margin-top").replace("px", ""))
            + parseInt(footer.css("padding-top").replace("px", ""))
            + parseInt(footer.css("padding-bottom").replace("px", "")) + 4;
        $("#main").css("padding-bottom", mainPaddingBottom);
    }
}

function buildUi() {
    var html = "";

    // Visualization
    html += "<div id=\"visualizer-row\" class=\"row\">";
    html += "<div class=\"col-xs-12\">";
    html += "<div id=\"visualizer-container\">";
    html += "</div>";
    html += "</div>";
    html += "</div>";

    html += "<div id=\"controls-row\" class=\"row\">";

    // Palo switcher + options (resolution and palmas) + play button
    html += "<div id=\"left-col\" class=\"col-xs-6 col-sm-6 col-md-8 col-lg-8\">";
    html += "<div class=\"row\">";

    // Palo switcher + options
    html += "<div id=\"palo-and-options\" class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6\">";

    // Palo switcher
    html += "<select id=\"palo\" class=\"form-control\">";
    $.each(window.aCompas.palos, function(paloIndex, paloData) {
        html += "<option value=\"" + paloData.slug + "\">";
        html += paloData.label;
        html += "</option>";
    });
    html += "</select>";

    // Options

    // Resolution
    html += "<div class=\"btn-group\" data-toggle=\"buttons\">";
    html += "<label class=\"btn btn-default btn-sm active\">";
    html += "<input type=\"radio\" class=\"resolution\" data-value=\"0\" autocomplete=\"off\" checked> Contratiempo";
    html += "</label>";
    html += "<label class=\"btn btn-default btn-sm\">";
    html += "<input type=\"radio\" class=\"resolution\" data-value=\"1\" autocomplete=\"off\"> Tiempo";
    html += "</label>";
    html += "</div>";

    // Instruments
    html += "<div>";
    html += "<div class=\"btn-group\" role=\"group\">";
    html += "<button class=\"toggle-instrument btn btn-default btn-sm active\" data-instrument=\"clara\">Palma clara</button>";
    html += "<button class=\"toggle-instrument btn btn-default btn-sm active\" data-instrument=\"sorda\">Palma sorda</button>";
    html += "<button class=\"toggle-instrument btn btn-default btn-sm active\" data-instrument=\"cajon\">Cajón</button>";
    html += "<button class=\"toggle-instrument btn btn-default btn-sm active\" data-instrument=\"udu\">Udu</button>";
    html += "<button class=\"toggle-instrument btn btn-default btn-sm\" data-instrument=\"click\">Click</button>";
    html += "</div>";
    html += "</div>"

    // Improvise
    html += "<div class=\"btn-group\" role=\"group\">";
    html += "<button id=\"improvise\" class=\"btn btn-default btn-sm active\" >Improvise</button>";
    html += "</div>";

    html += "</div>"; // End #palo-and-options

    // Play button + info zone
    html += "<div id=\"play-and-info-container\" class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6\">";
    html += "<div class=\"row\">"
    html += "<div class=\"col-xs-6 col-sm-6 col-md-12 col-lg-12\">";

    // Play button
    html += "<button class=\"play\">";
    html += "<span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>";
    html += "</button>";

    html += "</div>";
    html += "<div class=\"col-xs-6 col-sm-6 col-md-12 col-lg-12\">";

    // Info area
    html += "<div class=\"row\">"
    html += "<p id=\"info\" class=\"text-danger text-center\"></p>";
    html += "</div>";

    html += "</div>";
    html += "</div>"; // End .row
    html += "</div>"; // End #play-and-info-container

    html += "</div>"; // End .row
    html += "</div>"; // End Palo switcher + options (resolution and palmas) + play button

    // Sliders (tempo and volume)
    html += "<div id=\"right-col\" class=\"col-xs-6 col-sm-6 col-md-4 col-lg-4\">";
    html += "<div class=\"row\">";

    // Tempo
    html += "<div id=\"tempo-slider-container\" class=\"col-xs-6\">";
    html += "<label id=\"tempo-label\" class=\"label label-default\">Tempo:</label>";
    html += "<div id=\"tempo\">";
    html += "</div>"
    html += "</div>";
    // Volume
    html += "<div id=\"volume-slider-container\" class=\"col-xs-6\">";
    html += "<label id=\"volume-label\" class=\"label label-default\">Volume: " + window.aCompas.masterVolume + " %</label>";
    html += "<div id=\"volume\">";
    html += "</div>";
    html += "</div>";

    html += "</div>";
    html += "</div>"; // End #right-col

    html += "</div>"; // End .row

    $("#main").html(html);

    // Build svg visualization using raphael.js
    window.aCompas.paper = new Raphael("visualizer-container", 1200, 185);
    window.aCompas.paper.setViewBox(0, 0, 1200, 185, true);
    window.aCompas.paper.setSize('100%', '100%');
    window.aCompas.visualization = $("#visualizer-container > svg");

    // Set default palo
    setPalo(window.aCompas.defaultPaloSlug);
    $("#palo").val(window.aCompas.defaultPaloSlug);
    // On palo change
    $("#palo").change(function(e) {
        // Set rhythm style
        setPalo($(this).val());
        // Trick to force rendering the newly selected value on Cordova
        $(this).blur();
        // Track event in Piwik
        var paloData = null;
        $.each(window.aCompas.palos, function(paloIndex, paloData2) {
            if (window.aCompas.palo === paloData2.slug) {
                paloData = paloData2;
            }
        });
        _paq.push(['trackEvent', 'PaloSwitch', 'Set', paloData.label]);
    });

    // Volume slider
    $("#volume").slider({
        orientation: "vertical",
        min: 0,
        max: 100,
        tooltip: "hide",
        value: window.aCompas.masterVolume,
        reversed: true,
    }).on("slide", function(e) {
        window.aCompas.masterVolume = e.value;
        $("#volume-label").html("Volume: " + window.aCompas.masterVolume + " %");
    }).on("slideStop", function(e) {
        window.aCompas.masterVolume = e.value;
        $("#volume-label").html("Volume: " + window.aCompas.masterVolume + " %");
    });

    $('.play').on('click', function() {
        play();
    });

    $(".resolution").on("change", function(e) {
        window.aCompas.noteResolution = parseInt($(this).data("value"));
        // Track event in Piwik
        var label = null;
        if (window.aCompas.noteResolution == 0) {
            label = "Contratiempo";
        } else {
            label = "Tiempo";
        }
        _paq.push(['trackEvent', 'Options', 'Resolution', label]);
    });

    $(".toggle-instrument").on("click", function(e) {
        e.preventDefault();
        var instrument = $(this).data("instrument");
        var label = null;
        if ($(this).hasClass("active")) {
            window.aCompas[instrument] = false;
            $(this).removeClass("active");
            label = "Off";
        } else {
            window.aCompas[instrument] = true;
            $(this).addClass("active");
            label = "On";
        }
        _paq.push(['trackEvent', 'Instrument', instrument.charAt(0).toUpperCase() + instrument.slice(1), label]);
    });

    $("#improvise").on("click", function(e) {
        e.preventDefault();
        var label = null;
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            window.aCompas.improvise = false;
            label = "Off";
        } else {
            $(this).addClass("active")
            window.aCompas.improvise = true;
            label = "On";
        }
        _paq.push(['trackEvent', 'Options', "Improvisation", label]);
    });

    adaptToFooterHeight();

    $(window).on("resize", function(e) {
        resetDraw();
        adaptToFooterHeight();
        // Track event in Piwik
        trackDeviceOrientation();
    });

    trackDeviceOrientation();
}

function trackDeviceOrientation() {
    var label = null
    if (window.innerHeight > window.innerWidth) {
        label = "Portrait";
    } else {
        label = "Landscape";
    }
    if (window.aCompas.deviceOrientation !== label) {
        window.aCompas.deviceOrientation = label;
        _paq.push(['trackEvent', 'Device', 'Orientation', window.aCompas.deviceOrientation]);
    }
}

function loadSoundObj(obj, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', "common/audio/" + obj.src + "." + window.aCompas.audioFormat, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        // request.response is encoded... so decode it now
        window.aCompas.audioContext.decodeAudioData(request.response, function(buffer) {
            obj.buffer = buffer;
            }, function() {
                message.call($wrapper, 'error', 'Error loading ' + obj.src);
            });
    };

    request.send();
}

function loadSounds() {
    // iterate over sounds obj
    for (var i in window.aCompas.sounds) {
        if (window.aCompas.sounds.hasOwnProperty(i)) {
            // load sound
            loadSoundObj(window.aCompas.sounds[i]);
        }
    }
}

function initAudio() {
    try {
        // Create Web Audio API audio context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (window.AudioContext != undefined) {
            window.aCompas.audioContext = new AudioContext();
            // Detect the audio format to use for playing
            if (new Audio().canPlayType("audio/ogg")) {
                window.aCompas.audioFormat = "ogg";
            } else if (new Audio().canPlayType("audio/mp3")) {
                window.aCompas.audioFormat = "mp3";
            } else {
                window.aCompas.audioFormat = "wav";
            }
            // Load sounds
            loadSounds();
            // Set the message worker
            window.aCompas.timerWorker = new Worker("common/js/metronomeworker.js");
            window.aCompas.timerWorker.onmessage = function(e) {
                if (e.data === "tick") {
                    // console.log("tick!");
                    scheduler();
                } else {
                    console.log("message: " + e.data);
                }
            };
            window.aCompas.timerWorker.postMessage({"interval":window.aCompas.lookahead});
        } else {
            $("#will-not-work-modal").modal("show");
        }
    } catch (e) {
        $("#will-not-work-modal").modal("show");
    }
}

// ****************************
// ****************************
// Main initialization function
// ****************************
// ****************************

function initMetronome() {
    buildUi();
    // Apple iOS detection (See http://stackoverflow.com/questions/9038625/detect-if-device-is-ios)
    if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ) {
        $("#ios-modal").modal("show");
    }
    initAudio();
}
