// Set variables
var audioContext = null;
var isPlaying = false;      		// Are we currently playing?
var startTime;              		// The start time of the entire sequence.
var currentNote;        			// What note is currently last scheduled?
var palo = 'buleria-6';				// Default rhythm style
var tempo =  200 / 2;               // Set default tempo
var masterVolume = null;
var masterVolume = 100;             // Set default master volume
var lookahead = 25.0;       		// How frequently to call scheduling function 
                            		//(in milliseconds)
var scheduleAheadTime = 0.1;    	// How far ahead to schedule audio (sec)
                            		// This is calculated from lookahead, and overlaps 
                            		// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     		// when the next note is due.
var noteResolution = 0;     		// 0 = counter times, 1 = times only
var clapType = 0;                   // Default clap = light claps
var notesInQueue = [];      		// the notes that have been put into the web audio,
                            		// and may or may not have played yet. {note, time}
var timerWorker = null;     		// The Web Worker used to fire timer messages

var numberOfTimes = 12;				// Default rhythm times
var container = null;               // Svg visualization container
var paper = null;                   // Object returned by the Raphael constructor

// Palos data
var palos = [
    {
        slug: "buleria-6",
        label: "Buleria (6)"
    },
    {
        slug: "buleria-12",
        label: "Buleria (12)"
    },
    {
        slug: "solea",
        label: "Soleá"
    },
    {
        slug: "siguiriya",
        label: "Siguiriya"
    },
    {
        slug: "fandangos",
        label: "Fandangos"
    },
    {
        slug: "tangos",
        label: "Tangos"
    },
    {
        slug: "rumba",
        label: "Rumba"
    }
];

// Set functions
function playSound(buffer, start, vol) {
    // Create source, sounds gain and master gain
	var source = audioContext.createBufferSource(); 
	var gainNode = audioContext.createGain();
	var masterGainNode = audioContext.createGain();

	// Set sounds and master gain nodes
	gainNode.gain.value = vol;
	masterGainNode.gain.value = masterVolume / 100;
	source.buffer = buffer;

	// Connect everything
	source.connect(gainNode);
	gainNode.connect(masterGainNode);
	masterGainNode.connect( audioContext.destination );

	// Play
	source.start(start);
}

function nextNote() {
	// Calculate current beat length
	var secondsPerBeat = 60.0 / tempo;

	// Add beat length to last beat time  
	nextNoteTime += 0.25 * secondsPerBeat;

	// Advance the beat number, back to zero when loop finished
	currentNote++;    
	if (currentNote == numberOfTimes) {
		currentNote = 0;
	}
}

function scheduleNote( beatNumber, time ) {
	// push the note on the queue, even if we're not playing.
	notesInQueue.push( { note: beatNumber, time: time } );

	// If option "times only" selected, don't play counter times
	if ( (noteResolution === 1) && (beatNumber % 2 === 1) ) {
		return; 
	}

	switch (palo) {
		case 'buleria-6':
			scheduleNoteBuleria6(clapType, beatNumber, sounds, time);
			break ;
		case 'buleria-12':
			scheduleNoteBuleria12(clapType, beatNumber, sounds, time);
			break ;
		case 'solea':
			scheduleNoteSolea(clapType, beatNumber, sounds, time);
			break ;
		case 'siguiriya':
			scheduleNoteSiguiriya(clapType, beatNumber, sounds, time);
			break ;
		case 'fandangos':
			scheduleNoteFandangos(clapType, beatNumber, sounds, time);
			break ;
		case 'tangos':
			scheduleNoteTangos(clapType, beatNumber, sounds, time);
			break ;
		case 'rumba':
			scheduleNoteRumba(clapType, beatNumber, sounds, time);
			break ;
		default :
			console.log("Unknown palo \"" + palo + "\"");
			break ;
	}
}

function scheduler() {
	// while there are notes that will need to play before the next worker interval, 
	// schedule them and advance the pointer.
	while ( nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
		scheduleNote( currentNote, nextNoteTime );
		nextNote();
	}
}

function play() {

	var playButton = $('.play > .glyphicon');

	// start playing
	if (! isPlaying) { 

		currentNote = 0;
		nextNoteTime = audioContext.currentTime;

		// change play button
		playButton.removeClass('glyphicon-play').addClass('glyphicon-stop');
		$('.play').toggleClass('active');

		// Send message to worker
		timerWorker.postMessage("start");
		isPlaying = true;

		// stop playing
	} else { 

		// change play button
		playButton.removeClass('glyphicon-stop').addClass('glyphicon-play');
		$('.play').removeClass('active');

		// Send message to worker
		timerWorker.postMessage("stop");
		isPlaying = false;

	}
}

function draw() {

	// Take measures
	var x = Math.floor( 1200 / numberOfTimes );
	var y = x - Math.floor( 1200 / (numberOfTimes + 1) );

	// Draw svg
	for ( var i = 0; i < numberOfTimes; i++ ) {

		var bar = {
			'x': (x * i + y) - y / 2,
			'y': 150,
			'width': x - y,
			'height': 5
		};

		switch (palo) {
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
				console.log("Error: unknown palo \"" + palo + "\"");
				break ;
		}

	}

	// Necessary for jQuery to create svg
//	$("#visualizer-container").html($("#visualizer-container").html());

	console.log('drawn visualizer');
}

function resetDraw() {
    // Erase svg and draw again
    container.html("");
    draw();
}

// Updates the zone which contains information about the tempo
function onTempoChange() {
    var v = tempo * 2;
    var txt = null;
    var txtDiv = $("#info");
    switch (palo) {
        case "buleria-12":
            if ( v >= 230 ) {
                txt = "Your rhythm is very fast ...";
                if (txtDiv.css('opacity') == 0 ) {
                     txtDiv.append(txt);
                     txtDiv.animate({'opacity': '1'}, 300);
                } else {
                     txtDiv.empty().append(txt);
                }
            } else if ( v >= 120 && v <= 180 ) {
                 txt = "Your tempo is solea por buleria or alegria";
                if (txtDiv.css('opacity') == 0 ) {
                     txtDiv.append(txt);
                     txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 60 ) {
                txt = "Your rhythm is very slow ...";
                if (txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if (txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break;
        case "buleria-6":
            if ( v >= 270 ) {
                txt = "Your rhythm is very fast ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 120 ) {
                txt = "Your rhythm is very slow ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        case "fandangos":
            if ( v >= 200 ) {
                txt = "Your rhythm is very fast ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 90 ) {
                txt = "Your rhythm is very slow ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        case "rumba":
            if ( v >= 240 ) {
                txt = "Your rhythm is very fast ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 90 ) {
                txt = "Your rhythm is very slow ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        case "siguiriya":
            if ( v >= 160 ) {
                txt = "Your rhythm is very fast ...";
                if ( txtDiv.css('opacity') == 0 ) {
                     txtDiv.append(txt);
                     txtDiv.animate({'opacity': '1'}, 300);
                } else {
                     txtDiv.empty().append(txt);
                }
            } else if ( v <= 60 ) {
                txt = "Your rhythm is very slow ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        case "solea":
            if ( v >= 180 ) {
                txt = "Your rhythm is very fast ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v >= 120 && v <= 180 ) {
                txt = "Your tempo is solea por buleria or alegria";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 60 ) {
                txt = "Your rhythm is very slow ...";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        case "tangos":
            if ( v >= 180 ) {
                txt = "Your rhythm is por rumba";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else if ( v <= 90 ) {
                txt = "Your rhythm is por tientos";
                if ( txtDiv.css('opacity') == 0 ) {
                    txtDiv.append(txt);
                    txtDiv.animate({'opacity': '1'}, 300);
                } else {
                    txtDiv.empty().append(txt);
                }
            } else {
                if ( txtDiv.css('opacity') == 1 ) {
                    txtDiv.animate({'opacity': '0'}, 300, function() {
                        txtDiv.empty();
                    });
                }
            }
            break ;
        default :
            console.log("Error: unknown palo \"" + palo + "\"");
            return ;
            break ;
    }
}

function onPaloSwitch() {
    // Stop playing if needed
    if (isPlaying) {
        play();
    }
    // Set number of times
    switch (palo) {
        case 'buleria-6':
            numberOfTimes = 12;
            break ;
        case 'buleria-12':
            numberOfTimes = 24;
            break ;
        case 'solea':
            numberOfTimes = 24;
            break ;
        case 'siguiriya':
            numberOfTimes = 24;
            break ;
        case 'fandangos':
            numberOfTimes = 24;
            break ;
        case 'tangos':
            numberOfTimes = 16;
            break ;
        case 'rumba':
            numberOfTimes = 16;
            break ;
        default :
            console.log("Error: Unknown palo \"" + palo + "\"");
            break ;
    }

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

    html += "<div class=\"row\">";

    // Palo switcher + options (resolution and palmas) + play button
    html += "<div id=\"left-col\" class=\"col-xs-6 col-sm-6 col-md-8 col-lg-8\">";
    html += "<div class=\"row\">";

    // Palo switcher + options
    html += "<div id=\"palo-and-options\" class=\"col-xs-12 col-sm-12 col-md-6 col-lg-6\">";

    // Palo switcher
    html += "<label for=\"palo\" class=\"label label-default\">Rhythm</label>";
    html += "<select id=\"palo\" class=\"form-control\">";
    $.each(palos, function(paloIndex, palo) {
        html += "<option value=\"" + palo.slug + "\">";
        html += palo.label;
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

    // Tempo
    html += "<div class=\"slider-container\">";
    html += "<label id=\"tempo-label\" class=\"label label-default\">Tempo: " + tempo + " bpm</label>";
    html += "<div id=\"tempo\">";
    html += "</div>"
    html += "</div>";
    // Volume
    html += "<div class=\"slider-container\">";
    html += "<label id=\"volume-label\" class=\"label label-default\">Volume: " + masterVolume + " %</label>";
    html += "<div id=\"volume\">";
    html += "</div>";
    html += "</div>";

    html += "</div>"; // End #sliders

    html += "</div>"; // End .row

    $("#main").html(html);

    // Build svg visualization using raphael.js
    paper = new Raphael("visualizer-container", 1200, 185);
    paper.setViewBox(0, 0, 1200, 185, true);
    paper.setSize('100%', '100%');
    container = $("#visualizer-container > svg");

    // On palo change
    $("#palo").change(function(e) {
        // Set rhythm style
        palo = $(this).val();
        onPaloSwitch();
        // Trick to force rendering the newly selected value on Cordova
        $(this).blur();
    });

    // Tempo slider
    $("#tempo").slider({
        orientation: "vertical",
        min: 20,
        max: 350,
        tooltip: "hide",
        value: 200,
        reversed: true
    }).on("slide", function(e) {
        tempo = Math.floor(e.value / 2);
        $("#tempo-label").html("Tempo: " + tempo + " bpm");
        onTempoChange();
    }).on("slideStop", function(e) {
        tempo = Math.floor(e.value / 2);
        $("#tempo-label").html("Tempo: " + tempo + " bpm");
        onTempoChange();
    });
    // Volume slider
    $("#volume").slider({
        orientation: "vertical",
        min: 0,
        max: 100,
        tooltip: "hide",
        value: masterVolume,
        reversed: true,
    }).on("slide", function(e) {
        masterVolume = e.value;
        $("#volume-label").html("Volume: " + masterVolume + " %");
    }).on("slideStop", function(e) {
        masterVolume = e.value;
        $("#volume-label").html("Volume: " + masterVolume + " %");
    });

}

// ****************************
// ****************************
// Main initialization function
// ****************************
// ****************************

function initMetronome() {

    buildUi();
    draw();

    // Create Web Audio API audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    audioContext = new AudioContext();

    // Prepare loading sounds
    var format = '.' + (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');

    function loadSoundObj(obj, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', "common/audio/" + obj.src + format, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            // request.response is encoded... so decode it now
            audioContext.decodeAudioData(request.response, function(buffer) {
                obj.buffer = buffer;
                }, function() {
                    message.call($wrapper, 'error', 'Error loading ' + obj.src);
                });
        };

        request.send();
    }

    function loadSounds(obj) {
        var len = obj.length, i;

        // iterate over sounds obj
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                // load sound
                loadSoundObj(obj[i]);
            }
        }
    }

    // Declare sounds object
    sounds = {
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
    };

    // Load sounds
    loadSounds(sounds);

    // Set the message worker
    timerWorker = new Worker("common/js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        } else {
            console.log("message: " + e.data);
        }
    };
    timerWorker.postMessage({"interval":lookahead});

    // Set buttons
    $('.play').on('click', function() {
        play();
    });

    $(".resolution").on("change", function(e) {
        noteResolution = parseInt($(this).data("resolution"));
    });
    
    $(".clap-type").on("change", function(e) {
        clapType = parseInt($(this).data("clap-type"));
    });

    $(window).on("orientationchange", resetDraw);
    $(window).on("resize", resetDraw);

}
