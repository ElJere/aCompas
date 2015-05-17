// Initialize the metronome object
window.aCompas = {
    audioContext: null,
    isPlaying: false,               // Are we currently playing ?
    currentNote: null,              // What note is currently last scheduled ?
    defaultPaloSlug: "buleria-12",  // Slug of the default palo
    palo: null,                     // Current palo's slug
    masterVolume: 90,               // Default master volume
    lookahead: 30,                  // How frequently to call scheduling function ?
                                    // (in milliseconds)
    scheduleAheadTime: 0.3,         // How far ahead to schedule audio (sec)
                                    // This is calculated from lookahead, and overlaps
                                    // with next interval (in case the timer is late)
    masterGainNode: null,           // GainNode used for the master volume
    nextNoteTime: 0.0,              // When the next note is due ?
    noteResolution: 0,              // 0 = times + counter times, 1 = times only
    clara: true,                    // Is the palma clara track on ?
    sorda: true,                    // Is the palma sorda track on ?
    cajon: true,                    // Is the cajón track on ?
    udu: true,                      // Is the udu track on ?
    jaleo: false,                   // Is the jaleo track on ?
    click: false,                   // Is the click track on ?
    improvise: true,                // Is improvisation mode on ?
    timerWorker: null,              // The Web Worker used to fire timer messages
    nbBeatsInPattern: null,         // Number of beats in the current pattern (counting eighth notes)
    defaultBarHeight: 5,            // Initial height of a bar in the bar visualization (in pixels)
    barMaxHeight: null,             // Maximum height of a bar (float, in pixels)
    palos: null,                    // Palos data
    deviceOrientation: null,        // String ("Landscape" or "Portrait")
    playStartTime: null,            // The time when the user starts playing is stored
                                    // in this property
    audioFormat: null,              // Audio format to use for playing
    sounds: {                       // Sounds used by the application
        clara_1: {
            src: 'clara/clara_1',
            volume : 1
        },
        clara_2: {
            src: 'clara/clara_2',
            volume : 1
        },
        clara_3: {
            src: 'clara/clara_3',
            volume : 0.5
        },
        sorda_1: {
            src: 'sorda/sorda_1',
            volume : 0.3
        },
        sorda_2: {
            src: 'sorda/sorda_2',
            volume : 0.3
        },
        sorda_3: {
            src: "sorda/sorda_3",
            volume: 0.3
        },
        cajon_1: {
            src: 'cajon/cajon_1',
            volume: 0.6
        },
        cajon_2: {
            src: 'cajon/cajon_2',
            volume: 0.6
        },
        cajon_3: {
            src: 'cajon/cajon_3',
            volume: 0.6
        },
        udu_1: {
            src: 'udu/udu_1',
            volume : 1
        },
        udu_2: {
            src: 'udu/udu_2',
            volume : 0.5
        },
        jaleo_1: {
            src: "jaleo/jaleo_1",
            volume: 0.5
        },
        jaleo_2: {
            src: "jaleo/jaleo_2",
            volume: 0.5
        },
        jaleo_3: {
            src: "jaleo/jaleo_3",
            volume: 0.5
        },
        jaleo_4: {
            src: "jaleo/jaleo_4",
            volume: 0.5
        },
        jaleo_5: {
            src: "jaleo/jaleo_5",
            volume: 0.5
        },
        jaleo_6: {
            src: "jaleo/jaleo_6",
            volume: 0.5
        },
        jaleo_7: {
            src: "jaleo/jaleo_7",
            volume: 0.5
        },
        jaleo_8: {
            src: "jaleo/jaleo_8",
            volume: 0.5
        },
        jaleo_9: {
            src: "jaleo/jaleo_9",
            volume: 0.5
        },
        jaleo_10: {
            src: "jaleo/jaleo_10",
            volume: 0.5
        },
        jaleo_11: {
            src: "jaleo/jaleo_11",
            volume: 0.5
        },
        jaleo_12: {
            src: "jaleo/jaleo_12",
            volume: 0.5
        },
        jaleo_13: {
            src: "jaleo/jaleo_13",
            volume: 0.5
        },
        jaleo_14: {
            src: "jaleo/jaleo_14",
            volume: 0.5
        },
        jaleo_15: {
            src: "jaleo/jaleo_15",
            volume: 0.5
        },
        jaleo_16: {
            src: "jaleo/jaleo_16",
            volume: 0.5
        },
        jaleo_17: {
            src: "jaleo/jaleo_17",
            volume: 0.5
        },
        click_1: {
            src: 'click/click_1',
            volume: 0.1
        },
        click_2: {
            src: 'click/click_2',
            volume: 0.1
        }
    },
    soundCounts: {
        clara: 3,
        sorda: 3,
        cajon: 3,
        udu: 2,
        jaleo: 17
    },
    instruments: [
        "clara",
        "sorda",
        "cajon",
        "udu",
        "jaleo",
        "click"
    ]
}

// Palos data
//
// Tempo = number of quarter notes per minute
// Nb beats in pattern : number of beats in a pattern (counting an eighth note as a beat)
window.aCompas.palos = [
    {
        slug: "buleria-6",
        label: "Bulería (6)",
        minTempo: 25,
        maxTempo: 230,
        defaultTempo: 135,
        nbBeatsInPattern: 12,
        timeSignatureTop: 6,
        timeSignatureBottom: 8,
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
            0: 3,
            2: 1,
            4: 3,
            6: 1,
            8: 3,
            10: 2
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
            if (tempo >= 180) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo <= 65) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "buleria-12",
        label: "Bulería (12)",
        minTempo: 20,
        maxTempo: 230,
        defaultTempo: 135,
        nbBeatsInPattern: 24,
        timeSignatureTop: 12,
        timeSignatureBottom: 8,
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
            4: 3,
            6: 1,
            8: 2,
            10: 3,
            12: 3,
            14: 1,
            15: 3,
            16: 1,
            18: 3,
            19: 1,
            20: 3,
            22: 3
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
            if (tempo >= 155) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo <= 120 && tempo > 40) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if (tempo <= 40) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "fandangos",
        label: "Fandangos",
        minTempo: 20,
        maxTempo: 180,
        defaultTempo: 100,
        nbBeatsInPattern: 24,
        timeSignatureTop: 12,
        timeSignatureBottom: 8,
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
            if (tempo >= 135) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo <= 55) {
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
        timeSignatureTop: 4,
        timeSignatureBottom: 4,
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
            2: 2,
            3: 3,
            4: 1,
            6: 3,
            8: 1,
            9: 1,
            10: 2,
            11: 3,
            12: 1,
            14: 3
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
            if (tempo >= 240) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo <= 90) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "siguiriya",
        label: "Siguiriya",
        minTempo: 15,
        maxTempo: 120,
        defaultTempo: 60,
        nbBeatsInPattern: 24,
        timeSignatureTop: 12,
        timeSignatureBottom: 8,
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
            1: 3,
            2: 2,
            3: 3,
            4: 1,
            5: 3,
            6: 2,
            7: 2,
            8: 1,
            9: 3,
            10: 3,
            11: 3,
            12: 3,
            13: 2,
            14: 1,
            15: 3,
            16: 3,
            17: 3,
            18: 3,
            19: 2,
            20: 1,
            22: 3
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
            if (tempo >= 105) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo <= 40) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
        }
    },
    {
        slug: "solea",
        label: "Soleá",
        minTempo: 30,
        maxTempo: 130,
        defaultTempo: 65,
        nbBeatsInPattern: 24,
        timeSignatureTop: 12,
        timeSignatureBottom: 8,
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
            if (tempo >= 120) {
                setInfoMessage("Your rhythm is very fast");
            } else if (tempo >= 80 && tempo > 40) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if ( tempo <= 40 ) {
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
        timeSignatureTop: 4,
        timeSignatureBottom: 4,
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
            0: 3,
            1: 3,
            2: 1,
            3: 3,
            4: 3,
            6: 1,
            8: 3,
            9: 3,
            10: 1,
            11: 3,
            12: 1,
            14: 3
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

function localStorageSet(name, value) {
    window.localStorage.setItem(name, value);
}

function localStorageGet(name) {
    return window.localStorage.getItem(name);
}

// Set functions
function playSound(name, start, vol) {
    // If vol is null, use the sound's default volume
    if (vol === null) {
        vol = window.aCompas.sounds[name].volume;
    }
    // Lazy-load the master gain node
    if (window.aCompas.masterGainNode === null) {
        window.aCompas.masterGainNode = window.aCompas.audioContext.createGain();
        window.aCompas.masterGainNode.connect( window.aCompas.audioContext.destination );
    }
    // Create a gainNode
    var gainNode = window.aCompas.audioContext.createGain();
    // Set gain values
    window.aCompas.masterGainNode.gain.value = window.aCompas.masterVolume / 100;
    gainNode.gain.value = vol;
    // Create bufferSource
    var bufferSource = window.aCompas.audioContext.createBufferSource();
    bufferSource.buffer = window.aCompas.sounds[name].buffer;
    // Connect everything
    bufferSource.connect(gainNode);
    gainNode.connect(window.aCompas.masterGainNode);
    // Play
    bufferSource.start(start);
}

function getTempo() {
    return $("#tempo").data("slider").getValue();
}

function nextNote() {
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (paloData2.slug === window.aCompas.palo) {
            paloData = paloData2;
        }
    });
    // Add beat length to last beat time
    // Remark : here, a beat is actualy an eighth note
    var beatLength = null;
    var secondsPerQuarterNote = 60.0 / getTempo();
    if (paloData.timeSignatureBottom === 4) {
        beatLength = secondsPerQuarterNote / 2;
    } else { // paloData.timeSignatureBottom === 8
        // Remark : this short rule only applies to flamenco palos
        // where all x/8 time signatures are basicaly ternary
        beatLength = secondsPerQuarterNote / 3;
    }
    window.aCompas.nextNoteTime += beatLength;
    // Advance the beat number, going back to zero when the loop is finished
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

function scheduleJaleo(beatNumber, time, paloData) {
    if (window.aCompas.jaleo && paloData.beats[beatNumber] === "strong") {
        var willPlay = null;
        if (beatNumber === 0) {
            willPlay = true;
        } else {
            // Randomly chose if a sound will be played
            willPlay = Math.random() < .20;
        }
        if (willPlay) {
            var maxNbVoices = 3;
            var nbVoices = null;
            if (beatNumber === 0) {
                // Pick the number of voices which will actualy be used
                nbVoices = Math.ceil(Math.random() * maxNbVoices);
            } else {
                nbVoices = 1;
            }
            for (var i = 0; i < nbVoices; i++) {
                // Pick a random jaleo sound
                var nb = Math.round(Math.random() * (window.aCompas.soundCounts.jaleo - 1)) + 1;
                playSound("jaleo_" + nb, time, null);
            }
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

function scheduleNote(beatNumber, time) {
    // Don't schedule anything if the browser is lagging too much
    var maximumLag = 1; // Seconds
    if (window.aCompas.audioContext.currentTime - time > maximumLag) {
        return ;
    }
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
    scheduleJaleo(beatNumber, time, paloData);
    scheduleClick(beatNumber, time, paloData);
    // Animate visualization
    animateBar(beatNumber, time, paloData.beats[beatNumber]);
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
        $('.play').css("border-color", "firebrick").addClass('active');
        // Send message to worker
        window.aCompas.timerWorker.postMessage("start");
        window.aCompas.isPlaying = true;
        // Track event in Piwik
        _paq.push(['trackEvent', 'Playing', 'Play', paloData.label]);
    } else {
        // change play button
        playButton.removeClass('glyphicon-stop').addClass('glyphicon-play');
        $('.play').css("border-color", "tomato").removeClass('active');
        // Send message to worker
        window.aCompas.timerWorker.postMessage("stop");
        window.aCompas.isPlaying = false;
        // Track event in Piwik
        _paq.push(['trackEvent', 'Playing', 'Stop', paloData.label,
            Math.round(window.aCompas.audioContext.currentTime - window.aCompas.playStartTime)]);
    }
}

function callAtGivenTime(time, callback) {
    window.setTimeout(callback, Math.round((time - window.aCompas.audioContext.currentTime) * 1000));
}

function reduceBar(i, stepTime, stepHeight) {
    var bar = document.getElementById("bar-" + i);
    if (bar) {
        var currentHeight = parseFloat(bar.style.height.replace("px", ""));
        // When the function is called for the first time in the recursion,
        // compute the height to remove at each step
        if (stepHeight === null) {
            stepHeight = currentHeight * .20;
        }
        if (currentHeight > window.aCompas.defaultBarHeight) {
            window.setTimeout(function() {
                var newHeight = currentHeight - stepHeight;
                if (newHeight >= window.aCompas.defaultBarHeight) {
                    bar.style.height = newHeight + "px";
                    // Recursive call with the stepHeight parameter set
                    reduceBar(i, stepTime, stepHeight);
                } else {
                    bar.style.height = window.aCompas.defaultBarHeight + "px";
                    return ;
                }
            }, stepTime);
        }
    }
}

function animateBar(i, time, beatType) {
    callAtGivenTime(time, function() {
        var maxHeight = window.aCompas.barMaxHeight;
        if (beatType === "up") {
            maxHeight *= 2/3
        }
        if (beatType === "down") {
            maxHeight *= 1/3;
        }
        var bar = document.getElementById("bar-" + i);
        if (bar) {
            bar.style.height = maxHeight + "px";
            var stepTime = 50; // milliseconds
            reduceBar(i, stepTime, null);
        }
    });
}

function draw() {
    var html = "";
    var paloData = null;
    $.each(window.aCompas.palos, function(paloIndex, paloData2) {
        if (window.aCompas.palo === paloData2.slug) {
            paloData = paloData2;
        }
    });
    html += "<div class=\"row-1\">";
    for (var i = 0; i < window.aCompas.nbBeatsInPattern; i++) {
        html += "<div id=\"bar-" + i + "\" class=\"bar bar-" + paloData.beats[i] + "\"></div>";
    }
    html += "</div>"; // End .row-1
    html += "<div class=\"row-2\">";
    for (var i = 0; i < window.aCompas.nbBeatsInPattern; i++) {
        html += "<div class=\"beat-label beat-label-" + paloData.beats[i] + "\">";
        if (paloData.beatLabels[i] !== undefined) {
            html += paloData.beatLabels[i];
        }
        html += "</div>";
    }
    html += "</div>"; // End .row-2
    $("#visualizer").html(html);

    // Set height for #visualizer
    var ratio = 0.17; // height / width ratio
    var visualizerHeight = ratio * $("#visualizer").width();
    $("#visualizer").css("height", visualizerHeight);
    // Set CSS for each bar
    var sideMargin = 2; // px
    var columnWidth = ($("#visualizer").width() - (window.aCompas.nbBeatsInPattern * sideMargin * 2)) / window.aCompas.nbBeatsInPattern;
    $("#visualizer .bar, #visualizer .beat-label").css({
        marginLeft: sideMargin + "px",
        marginRight: sideMargin + "px",
        width: columnWidth
    });
    var barLeft = null;
    for (var i = 0; i < window.aCompas.nbBeatsInPattern; i++) {
        barLeft = (columnWidth + (2 * sideMargin)) * i;
        $("#bar-" + i).css("left", barLeft);
    }
    $("#visualizer .bar").css("height", window.aCompas.defaultBarHeight + "px");
    var row1Height = visualizerHeight - $("#visualizer > .row-2").height();
    $("#visualizer > .row-1").css("height", row1Height + "px");
    window.aCompas.barMaxHeight = Math.ceil(row1Height);
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
    localStorageSet("palo", paloSlug);
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
    var tempoValue = paloData.defaultTempo;
    if (localStorageGet("tempo-" + window.aCompas.palo)) {
        tempoValue = parseInt(localStorageGet("tempo-" + window.aCompas.palo));
    }
    // Build tempo slider
    $("#tempo").slider({
        orientation: "vertical",
        min: paloData.minTempo,
        max: paloData.maxTempo,
        tooltip: "hide",
        value: tempoValue,
        reversed: true
    }).on("slide", function(e) {
        $("#tempo-label").html("<i class=\"glyphicon glyphicon-time\"></i> : " + getTempo() + " bpm");
        paloData.setTempoInfo();
    }).on("slideStop", function(e) {
        $("#tempo-label").html("<i class=\"glyphicon glyphicon-time\"></i> : " + getTempo() + " bpm");
        paloData.setTempoInfo();
        localStorageSet("tempo-" + window.aCompas.palo, getTempo());
    });
    // Force rendering of the slider's label
    $("#tempo").trigger("slideStop");
    // Draw visualization
    draw();
}

function adaptToFooterHeight() {
    var footer = $("footer");
    if (footer.length > 0) {
        var mainPaddingBottom = footer.height() 
            + parseInt(footer.css("margin-top").replace("px", ""))
            + parseInt(footer.css("padding-top").replace("px", ""))
            + parseInt(footer.css("padding-bottom").replace("px", "")) 
            + parseInt($(".slider-handle").css("height").replace("px", "")) / 2;
        $("#main").css("padding-bottom", mainPaddingBottom);
    }
}

function setVolumeLabel() {
    $("#volume-label").html("<i class=\"glyphicon glyphicon-volume-up\"></i> : " + window.aCompas.masterVolume + " %");
}

function buildUi() {
    var html = "";

    // Visualization
    html += "<div id=\"visualizer-row\" class=\"container custom-row\">";
    html += "    <div class=\"row\">";
    html += "        <div id=\"visualizer\" class=\"col-xs-12\">";
    html += "        </div>";
    html += "    </div>";
    html += "</div>";

    html += "<div id=\"controls-row\" class=\"container custom-row\">";
    html += "    <div class=\"row\">";

    // Palo switcher + options (resolution and palmas) + play button
    html += "        <div id=\"left-col\" class=\"col-xs-6 col-sm-6 col-md-4 col-lg-4 custom-row\">";

    // Palo switcher + options
    html += "            <div id=\"palo-and-options\">";

    // Palo switcher
    html += "                <select id=\"palo\" class=\"form-control custom-row\">";
    $.each(window.aCompas.palos, function(paloIndex, paloData) {
        html += "                <option value=\"" + paloData.slug + "\">";
        html +=                      paloData.label;
        html += "                </option>";
    });
    html += "                </select>";

    // Options

    // Resolution
    html += "                <div class=\"custom-row\">";
    html += "                    <div class=\"btn-group btn-group-justified\" role=\"group\">";
    html += "                        <div class=\"btn-group\" role=\"group\">";
    html += "                            <button class=\"resolution resolution-0 btn btn-default btn-sm active\" title=\"Up beats and down beats\" data-resolution=\"0\">";
    html += "                                <img src=\"common/images/croche.svg\" class=\"btn-icon\" />";
    html += "                            </button>";
    html += "                        </div>";
    html += "                        <div class=\"btn-group\" role=\"group\">";
    html += "                            <button class=\"resolution resolution-1 btn btn-default btn-sm\" title=\"Up beats only\" data-resolution=\"1\">";
    html += "                                <img src=\"common/images/noire.svg\" class=\"btn-icon\" />";
    html += "                            </button>";
    html += "                        </div>";
    html += "                    </div>";
    html += "                </div>";

    // Instruments
    html += "                <div class=\"custom-row\">";
    html += "                    <button id=\"toggle-instruments\" class=\"btn btn-default btn-lg btn-block\" title=\"Toggle instruments\">";
    html += "                        <i class=\"glyphicon glyphicon-th-list\"></i><span class=\"btn-text\"> Instruments</span>";
    html += "                    </button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle active\" data-instrument=\"clara\" title=\"Palma clara\"><img src=\"common/images/clara.svg\" class=\"btn-instrument\" /></button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle active\" data-instrument=\"sorda\" title=\"Palma sorda\"><img src=\"common/images/sorda.svg\" class=\"btn-instrument\" /></button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle active\" data-instrument=\"cajon\" title=\"Cajón\"><img src=\"common/images/cajon.svg\" class=\"btn-instrument\" /></button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle active\" data-instrument=\"udu\" title=\"Udu\"><img src=\"common/images/udu.svg\" class=\"btn-instrument\" /></button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle\" data-instrument=\"click\" title=\"Click\"><img src=\"common/images/click.svg\" class=\"btn-instrument\" /></button>";
    html += "                    <button class=\"toggle-instrument btn btn-default btn-lg btn-circle\" data-instrument=\"jaleo\" title=\"Jaleo\"><img src=\"common/images/jaleo.svg\" class=\"btn-instrument\" /></button>";
    html += "                </div>";

    // Improvise
    html += "                <div class=\"custom-row\">";
    html += "                    <button id=\"improvise\" class=\"btn btn-default btn-lg btn-block active\" title=\"Add some randomness to the rhythmic pattern\">";
    html += "                        <i class=\"glyphicon glyphicon-random\"></i><span class=\"btn-text\"> Improvise</span>";
    html += "                    </button>";
    html += "                </div>";

    // Info area
    html += "                <p id=\"info\" class=\"custom-row text-danger text-center\"></p>";

    html += "            </div>"; // End #palo-and-options
    html += "        </div>"; // End Palo switcher + options (resolution and palmas)

    // Sliders (tempo and volume)
    html += "        <div id=\"right-col\" class=\"col-xs-6 col-sm-6 col-md-4 col-md-push-4 col-lg-4 col-lg-push-4 custom-row text-center\">";
    html += "            <div class=\"row\">";

    // Tempo
    html += "                <div id=\"tempo-slider-container\" class=\"col-xs-6\">";
    html += "                    <div class=\"row\">";
    html += "                        <div id=\"tempo-label\"><i class=\"glyphicon glyphicon-time\"></i> : </div>";
    html += "                    </div>"
    html += "                    <div id=\"tempo\">";
    html += "                    </div>";
    html += "                </div>";

    // Volume
    html += "                <div id=\"volume-slider-container\" class=\"col-xs-6\">";
    html += "                    <div class=\"row\">";
    html += "                        <div id=\"volume-label\"><i class=\"glyphicon glyphicon-volume-up\"></i> : " + window.aCompas.masterVolume + " %</div>";
    html += "                    </div>"
    html += "                    <div id=\"volume\">";
    html += "                    </div>";
    html += "                </div>";

    html += "            </div>";
    html += "        </div>"; // End #right-col

    // Play button + info zone
    html += "        <div id=\"play-container\" class=\"col-xs-12 col-sm-12 col-md-4 col-md-pull-4 col-lg-4 col-lg-pull-4 custom-row text-center\">";

    // Play button
    html += "            <button class=\"play\">";
    html += "                <span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>";
    html += "            </button>";

    html += "        </div>"; // End #play-container

    html += "    </div>"; // End .row
    html += "</div>"; // End #controls-row

    $("#main").html(html);

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
        setVolumeLabel();
    }).on("slideStop", function(e) {
        window.aCompas.masterVolume = e.value;
        setVolumeLabel();
        localStorageSet("volume", window.aCompas.masterVolume);
    });

    $('.play').on('click', function() {
        play();
    });

    $(".resolution").on("click", function(e) {
        window.aCompas.noteResolution = $(this).hasClass("resolution-0") ? 0 : 1;
        localStorageSet("resolution", window.aCompas.noteResolution);
        var label = null;
        if (window.aCompas.noteResolution == 0) {
            $(".resolution-0").addClass("active");
            $(".resolution-1").removeClass("active")
            label = "Contratiempo";
        } else {
            $(".resolution-1").addClass("active");
            $(".resolution-0").removeClass("active")
            label = "Tiempo";
        }
        // Track event in Piwik
        _paq.push(['trackEvent', 'Options', 'Resolution', label]);
    });

    $("#toggle-instruments").on("click", function() {
        var $this = $(this);
        if ($this.hasClass("open")) {
            $(".toggle-instrument").fadeOut(function() {
                $this.removeClass("open");
            });
        }
        else {
            $(".toggle-instrument").fadeIn(function() {
                $this.addClass("open");
            });
        }
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
        localStorageSet("instrument-" + instrument, window.aCompas[instrument]);
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
        localStorageSet("improvise", window.aCompas.improvise);
        _paq.push(['trackEvent', 'Options', "Improvisation", label]);
    });

    $(window).on("resize", function(e) {
        draw();
        adaptToFooterHeight();
        adaptInstrumentsMenu();
        // Track event in Piwik
        trackDeviceOrientation();
    });

    restoreValuesFromLocalStorage();
    adaptToFooterHeight();
    adaptInstrumentsMenu();
    trackDeviceOrientation();
}

function restoreValuesFromLocalStorage() {
    // Palo
    var paloSlug = (localStorageGet("palo") !== null) ? localStorageGet("palo"): window.aCompas.defaultPaloSlug;
    setPalo(paloSlug);
    $("#palo").val(paloSlug);
    // Resolution
    if (localStorageGet("resolution") !== null && parseInt(localStorageGet("resolution")) !== window.aCompas.noteResolution) {
        $(".resolution[data-resolution=" + parseInt(localStorageGet("resolution")) + "]").click();
    }
    // Instruments
    $.each(window.aCompas.instruments, function(index, instrumentSlug) {
        if (localStorageGet("instrument-" + instrumentSlug) !== null && JSON.parse(localStorageGet("instrument-" + instrumentSlug)) !== window.aCompas[instrumentSlug]) {
            $(".toggle-instrument[data-instrument=" + instrumentSlug + "]").click();
        }
    });
    // Improvise
    if (localStorageGet("improvise") !== null && JSON.parse(localStorageGet("improvise")) !== window.aCompas.improvise) {
        $("#improvise").click();
    }
    // Volume
    if (localStorageGet("volume") !== null && parseInt(localStorageGet("volume")) !== window.aCompas.masterVolume) {
        var volume = parseInt(localStorageGet("volume"));
        window.aCompas.masterVolume = volume
        $("#volume").data("slider").setValue(volume);
        setVolumeLabel();
    }
}

function adaptInstrumentsMenu() {
    // Display instruments buttons
    var radius = 60;
    var fields = $('.toggle-instrument');
    var instruButton = $('#toggle-instruments');
    var centerX = instruButton.position().left + $("#palo-and-options").width() / 2;
    var centerY = instruButton.offset().top - $("#palo-and-options").offset().top;
    var angle = - Math.PI / 2,
        step = (2 * Math.PI) / fields.length;

    fields.each(function() {
        var x = centerX + radius * Math.cos(angle) - $(this).width() / 2 - parseFloat($(this).css("padding-left").replace("px", ""));
        var y = centerY + radius * Math.sin(angle);
        $(this).css({
            left: x + 'px',
            top: y + 'px'
        });
        angle += step;
    });
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
            if (new Audio().canPlayType("audio/flac")) {
                window.aCompas.audioFormat = "flac";
            } else if (new Audio().canPlayType("audio/ogg")) {
                window.aCompas.audioFormat = "ogg";
            } else if (new Audio().canPlayType("audio/mpeg")) {
                window.aCompas.audioFormat = "mp3";
            } else if (new Audio().canPlayType("audio/mp4")) {
                window.aCompas.audioFormat = "mp4";
            } else if (new Audio().canPlayType("audio/wav")) {
                window.aCompas.audioFormat = "wav";
            } else {
                throw new Error("None of the available audio formats can be played");
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
