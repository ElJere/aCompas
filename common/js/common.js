// Initialize the metronome object
window.aCompas = {
    audioContext: null,
    isPlaying: false,               // Are we currently playing ?
    currentNote: null,              // What note is currently last scheduled ?
    defaultPaloSlug: "tangos",  // Slug of the default palo
    palo: null,                     // Current palo's slug
    masterVolume: 90,               // Default master volume
    lookahead: 25.0,                // How frequently to call scheduling function ?
                                    // (in milliseconds)
    scheduleAheadTime: 0.1,         // How far ahead to schedule audio (sec)
                                    // This is calculated from lookahead, and overlaps
                                    // with next interval (in case the timer is late)
    nextNoteTime: 0.0,              // When the next note is due ?
    noteResolution: 0,              // 0 = times + counter times, 1 = times only
    clapType: 0,                    // 0 = palmas claras, 1 = palmas sordas
    timerWorker: null,              // The Web Worker used to fire timer messages
    nbBeatsInPattern: null,         // Number of beats in the current pattern (counting eighth notes)
    visualization: null,            // <svg> visualization
    paper: null,                     // raphael.js constructor returns a paper object
                                    // used to manipulate the SVG visualization
    palos: null,                    // Palos data
    playStartTime: null,            // The time when the user starts playing is stored
                                    // in this property
    audioFormat: null,              // Audio format to use for playing
    sounds: {                       // Sounds used by the application
        clara_1 : {
            src : 'clara_1',
            volume : 1
        },
        clara_2 : {
            src : 'clara_2',
            volume : 1
        },
        clara_3 : {
            src : 'clara_3',
            volume : 0.5
        },
        sorda_1 : {
            src : 'sorda_1',
            volume : 1
        },
        sorda_2 : {
            src : 'sorda_2',
            volume : 1
        },
        udu_1 : {
            src : 'udu_1',
            volume : 1
        },
        udu_2 : {
            src : 'udu_2',
            volume : 0.5
        }
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
        minTempo: 20,
        maxTempo: 170,
        defaultTempo: 100,
        nbBeatsInPattern: 12,
        nbCellsInPattern: 1,
        rhythmicSignature: "6/8",
        description: ""
    },
    {
        slug: "buleria-12",
        label: "Buleria (12)",
        minTempo: 20,
        maxTempo: 170,
        defaultTempo: 100,
        nbBeatsInPattern: 24,
        nbCellsInPattern: 1,
        rhythmicSignature: "12/8",
        description: ""
    },
    {
        slug: "fandangos",
        label: "Fandangos",
        minTempo: 15,
        maxTempo: 125,
        defaultTempo: 75,
        nbBeatsInPattern: 24,
        nbCellsInPattern: 1,
        rhythmicSignature: "12/8",
        description: ""
    },
    {
        slug: "rumba",
        label: "Rumba",
        minTempo: 15,
        maxTempo: 170,
        defaultTempo: 100,
        nbBeatsInPattern: 16,
        nbCellsInPattern: 2,
        rhythmicSignature: "4/4",
        description: ""
    },
    {
        slug: "siguiriya",
        label: "Siguiriya",
        minTempo: 10,
        maxTempo: 90,
        defaultTempo: 40,
        nbBeatsInPattern: 24,
        nbCellsInPattern: 1,
        rhythmicSignature: "12/8",
        description: ""
    },
    {
        slug: "solea",
        label: "Soleá",
        minTempo: 30,
        maxTempo: 130,
        defaultTempo: 50,
        nbBeatsInPattern: 24,
        nbCellsInPattern: 1,
        rhythmicSignature: "12/8",
        description: ""
    },
    {
        slug: "tangos",
        label: "Tangos",
        minTempo: 15,
        maxTempo: 170,
        defaultTempo: 85,
        nbBeatsInPattern: 16,
        nbCellsInPattern: 2,
        rhythmicSignature: "4/4",
        description: ""
    }
];

// Set functions
function playSound(buffer, start, vol) {
    // Create source, sounds gain and master gain
	var source = window.aCompas.audioContext.createBufferSource();
	var gainNode = window.aCompas.audioContext.createGain();
	var masterGainNode = window.aCompas.audioContext.createGain();

	// Set sounds and master gain nodes
	gainNode.gain.value = vol;
	masterGainNode.gain.value = window.aCompas.masterVolume / 100;
	source.buffer = buffer;

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
	window.aCompas.nextNoteTime += 0.25 * secondsPerBeat;

	// Advance the beat number, back to zero when loop finished
	window.aCompas.currentNote++;
	if (window.aCompas.currentNote === window.aCompas.nbBeatsInPattern) {
		window.aCompas.currentNote = 0;
	}
}

function scheduleNote( beatNumber, time ) {
	// If option "times only" selected, don't play counter times
	if ( (window.aCompas.noteResolution === 1) && (beatNumber % 2 === 1) ) {
		return; 
	}

	switch (window.aCompas.palo) {
		case 'buleria-6':
			scheduleNoteBuleria6(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'buleria-12':
			scheduleNoteBuleria12(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'solea':
			scheduleNoteSolea(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'siguiriya':
			scheduleNoteSiguiriya(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'fandangos':
			scheduleNoteFandangos(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'tangos':
			scheduleNoteTangos(window.aCompas.clapType, beatNumber, time);
			break ;
		case 'rumba':
			scheduleNoteRumba(window.aCompas.clapType, beatNumber, time);
			break ;
		default :
			console.log("Unknown palo \"" + window.aCompas.palo + "\"");
			break ;
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

function draw() {

	// Take measures
	var x = Math.floor( 1200 / window.aCompas.nbBeatsInPattern );
	var y = x - Math.floor( 1200 / (window.aCompas.nbBeatsInPattern + 1) );

	// Draw svg
	for ( var i = 0; i < window.aCompas.nbBeatsInPattern; i++ ) {

		var bar = {
			'x': (x * i + y) - y / 2,
			'y': 150,
			'width': x - y,
			'height': 5
		};

		switch (window.aCompas.palo) {
			case 'buleria-6':
				drawBuleria6(i, bar);
				break ;
			case 'buleria-12':
				drawBuleria12(i, bar);
				break ;
			case 'solea':
				drawSolea(i, bar);
				break ;
			case 'siguiriya':
				drawSiguiriya(i, bar);
				break ;
			case 'fandangos':
				drawFandangos(i, bar);
				break ;
			case 'tangos':
				drawTangos(i, bar);
				break ;
			case 'rumba':
				drawRumba(i, bar);
				break ;
			default :
				console.log("Error: unknown palo \"" + window.aCompas.palo + "\"");
				break ;
		}

	}

	console.log('Drawn visualizer');
}

function resetDraw() {
    // Erase svg and draw again
    window.aCompas.visualization.html("");
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

// Updates the zone which contains information about the tempo
function onTempoChange() {
//TODO Compare with tempo without multiplying by 2
    var v = getTempo() * 2;
    switch (window.aCompas.palo) {
        case "buleria-12":
            if ( v >= 230 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v >= 120 && v <= 180 ) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if ( v <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break;
        case "buleria-6":
            if ( v >= 270 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v <= 120 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break ;
        case "fandangos":
            if ( v >= 200 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v <= 90 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break ;
        case "rumba":
            if ( v >= 240 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v <= 90 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break ;
        case "siguiriya":
            if ( v >= 160 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break ;
        case "solea":
            if ( v >= 180 ) {
                setInfoMessage("Your rhythm is very fast");
            } else if ( v >= 120 && v <= 180 ) {
                setInfoMessage("Your tempo is solea por buleria or alegria");
            } else if ( v <= 60 ) {
                setInfoMessage("Your rhythm is very slow");
            } else {
                setInfoMessage(null);
            }
            break ;
        case "tangos":
            if ( v >= 180 ) {
                setInfoMessage("Your rhythm is por rumba");
            } else if ( v <= 90 ) {
                setInfoMessage("Your rhythm is por tientos");
            } else {
                setInfoMessage(null);
            }
            break ;
        default :
            console.log("Error: unknown palo \"" + window.aCompas.palo + "\"");
            return ;
            break ;
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
        onTempoChange();
    }).on("slideStop", function(e) {
        $("#tempo-label").html("Tempo: " + getTempo() + " bpm");
        onTempoChange();
    });
    // Force rendering of the slider's label
    $("#tempo").trigger("slideStop");
    // Reset visualization
    resetDraw();
}

function buildUi() {
    var html = "";

    // Visualization
    html += "<div class=\"row\">";
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
    html += "<label for=\"palo\" class=\"label label-default\">Rhythm</label>";
    html += "<select id=\"palo\" class=\"form-control\">";
    $.each(window.aCompas.palos, function(paloIndex, paloData) {
        html += "<option value=\"" + paloData.slug + "\">";
        html += paloData.label;
        html += "</option>";
    });
    html += "</select>";

    // Options

    // Resolution
    html += "<label class=\"label label-default\">Resolution</label>";
    html += "<div class=\"btn-group\" data-toggle=\"buttons\">";
    html += "<label class=\"btn btn-xs active\">";
    html += "<input type=\"radio\" name=\"options\" class=\"resolution\" data-resolution=\"0\" autocomplete=\"off\" checked> Contratiempo";
    html += "</label>";
    html += "<label class=\"btn btn-xs\">";
    html += "<input type=\"radio\" name=\"options\" class=\"resolution\" data-resolution=\"1\" autocomplete=\"off\"> Tiempo";
    html += "</label>";
    html += "</div>";
    // Palmas
    html += "<label class=\"label label-default\">Palmas</label>";
    html += "<div class=\"btn-group\" data-toggle=\"buttons\">";
    html += "<label class=\"btn btn-xs active\">";
    html += "<input type=\"radio\" name=\"options\" class=\"clap-type\" data-clap-type=\"0\" autocomplete=\"off\" checked> Claras";
    html += "</label>";
    html += "<label class=\"btn btn-xs\">";
    html += "<input type=\"radio\" name=\"options\" class=\"clap-type\" data-clap-type=\"1\" autocomplete=\"off\"> Sordas";
    html += "</label>";
    html += "</div>";

    html += "</div>";

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
    html += "<div class=\"slider-container col-xs-6\">";
    html += "<label id=\"tempo-label\" class=\"label label-default\">Tempo:</label>";
    html += "<div id=\"tempo\">";
    html += "</div>"
    html += "</div>";
    // Volume
    html += "<div class=\"slider-container col-xs-6\">";
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
        window.aCompas.noteResolution = parseInt($(this).data("resolution"));
        // Track event in Piwik
        var label = null;
        if (window.aCompas.noteResolution == 0) {
            label = "Contratiempo";
        } else {
            label = "Tiempo";
        }
        _paq.push(['trackEvent', 'Options', 'Resolution', label]);
    });
    
    $(".clap-type").on("change", function(e) {
        window.aCompas.clapType = parseInt($(this).data("clap-type"));
        // Track event in Piwik
        var label = null;
        if (window.aCompas.clapType == 0) {
            label = "Claras";
        } else {
            label = "Sordas";
        }
        _paq.push(['trackEvent', 'Options', 'Palmas', label]);
    });

    $(window).on("orientationchange", resetDraw);
    $(window).on("resize", resetDraw);
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
