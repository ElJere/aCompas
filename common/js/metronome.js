// Set variables
var audioContext = null;
var isPlaying = false;      		// Are we currently playing?
var startTime;              		// The start time of the entire sequence.
var currentNote;        			// What note is currently last scheduled?
var palo = 'buleria-6';				// Default rhythm style
var tempo =  200 / 2;               // Set default tempo
var masterVolume = 80;              // Set default master volume
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
var container = null;               // Select the drawing svg container

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
	for (  i = 0; i < numberOfTimes; i++ ) {

		var bar = {
			'x': (x * i + y) - y / 2,
			'y': 250,
			'width': x - y,
			'height': 5,
			'fill': 'tomato'
		};

		var number = null;
 
		switch (palo) {
			case 'buleria-6':
				drawBuleria6(i, bar, container);
				break ;
			case 'buleria-12':
				drawBuleria12(i, bar, container);
				break ;
			case 'solea':
				drawSolea(i, bar, container);
				break ;
			case 'siguiriya':
				drawSiguiriya(i, bar, container);
				break ;
			case 'fandangos':
				drawFandangos(i, bar, container);
				break ;
			case 'tangos':
				drawTangos(i, bar, container);
				break ;
			case 'rumba':
				drawRumba(i, bar, container);
				break ;
			default :
				console.log("Unknown palo \"" + palo + "\"");
				break ;
		}

	}

	// Necessary for jQuery to create svg
	$("#" + palo + " .visualizer_div").html($("#" + palo + " .visualizer_div").html());
	console.log('drawn visualizer');

}

function resetDraw() {
	// Erase svg and draw again
	container.contents().remove();
	draw();
}

function buildUi() {
	var html = "";
	// Fill #palos
	$.each(palos, function(index, palo) {
		var active = "";
		if (index === 0)
			active = "active";
		html += "<li role=\"presentation\" class=\"" + active + "\">";
		html += "<a href=\"#" + palo.slug + "\" aria-controls=\"" + palo.slug + "\" role=\"tab\" data-toggle=\"tab\">" + palo.label + "</a>";
		html += "</li>";
	});
	$("#palos").html(html);
	// Fill #main-tab-content
	html = "";
	$.each(palos, function(index, palo) {
		var active = "";
		if (index === 0)
			active = "active";
		html += "<div id=\"" + palo.slug + "\" role=\"tabpanel\" class=\"tab-pane fade in " + active + "\">";
		html += "<section class=\"controls row\">";
		html += "<div class=\"col-xs-4 col-sm-3\">";
		html += "<h3 class=\"play-label\"><small>Play</small></h3>";
		html += "<button class=\"play\">";
		html += "<span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>";
		html += "</button>";
		html += "</div>";
		html += "<div class=\"col-xs-4 col-sm-3 tempo-container\">";
		html += "<h3 class=\"speed-label\"><small>Speed</small></h3>";
		html += "<input class=\"tempo\" value=\"200\">";
		html += "</div>";

		html += "<div class=\"col-xs-4 col-sm-3 volume-container\">";
		html += "<h3 class=\"volume-label\"><small>Volume</small></h3>";
		html += "<input class=\"masterVolume\" value=\"80\">";
		html += "</div>";

		html += "<div class=\"col-xs-12 col-sm-3\">";
		html += "<div class=\"row\">";
		html += "<div class=\"col-xs-6 col-sm-12\">";
		html += "<h3><small>Resolution</small></h3>";
		html += "<div class=\"btn-group\" data-toggle=\"buttons\">";
		html += "<label class=\"btn btn-sm active\">";
		html += "<input type=\"radio\" name=\"options\" class=\"resolution\" data-resolution=\"0\" autocomplete=\"off\" checked> Contratiempo";
		html += "</label>";
		html += "<label class=\"btn btn-sm\">";
		html += "<input type=\"radio\" name=\"options\" class=\"resolution\" data-resolution=\"1\" autocomplete=\"off\"> Tiempo";
		html += "</label>";
		html += "</div>";
		html += "</div>";
		html += "<div class=\"col-xs-6 col-sm-12\">";
		html += "<h3><small>Palmas</small></h3>";
		html += "<div class=\"btn-group\" data-toggle=\"buttons\">";
		html += "<label class=\"btn btn-sm active\">";
		html += "<input type=\"radio\" name=\"options\" class=\"clap-type\" data-clap-type=\"0\" autocomplete=\"off\" checked> Claras";
		html += "</label>";
		html += "<label class=\"btn btn-sm\">";
		html += "<input type=\"radio\" name=\"options\" class=\"clap-type\" data-clap-type=\"1\" autocomplete=\"off\"> Sordas";
		html += "</label>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		html += "</div>";

		html += "</section>";

		html += "<p class=\"text-danger\">Info : </p>";
		html += "<section class=\"visualizer_div\">";
		html += "<svg version=\"1.1\" class=\"visualizer\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 1200 300\" enable-background=\"new 0 0 1200 300\" xml:space=\"preserve\">";
		html += "</svg>";
		html += "</section>";

		html += "</div>";
	});
	$("#main-tab-content").html(html);
}

// ****************************
// ****************************
// Main initialization function
// ****************************
// ****************************

function initMetronome() {
	buildUi();

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

	// Load svg
	container = $("#" + palo + " svg.visualizer");
	draw();

	// Set buttons
	$('.play').on('click', function() {
		play();
	});

	$(document).keydown(function(e) {
		if (e.keyCode == '32') {
			play();
		}
	});

	// Change tabs
	$('#palos a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	// On tab change, set actual rhythm datas
	$('#palos a').on('shown.bs.tab', function (e) {

		// newly activated tab : e.target
		// previous active tab : e.relatedTarget

		// Stop playing if needed
		if (isPlaying) {
			play();
		} 

		// Set rhythm style
		palo = $(e.target).attr('aria-controls');

		// Reset options
		noteResolution = 0;
		clapType = 0;

		// Select the drawing svg container
		container = $("#" + palo + " svg.visualizer");

		// Set rhythm tempo
		tempo = parseInt($("#" + palo + " .tempo").val()) / 2;

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
				console.log("Unknown palo \"" + palo + "\"");
				break ;
		}

		console.log('tab shown : ' + palo + ', tempo : ' + tempo);

		// Reset svg
		resetDraw();

	});

	// Set volume button for each tab
	$.each(palos, function(paloIndex, palo) {
		$('#' + palo.slug + ' .masterVolume').knob({
			width:104,
			height:104,            
			min:0,
			max:100,
			step:1,
			angleArc:360,
			displayInput:true,
			thickness:'.2',
			inputColor:'#777',
			font:'arial',
			fontWeight:'normal',
			fgColor:'tomato',             
			release:function (v) { 
				masterVolume = v;
				console.log('new masterVolume = ' + v);
		        }
		});
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
