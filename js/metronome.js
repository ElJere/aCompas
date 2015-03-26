// Set variables
var audioContext = null;
var isPlaying = false;      		// Are we currently playing?
var startTime;              		// The start time of the entire sequence.
var currentNote;        			// What note is currently last scheduled?
var palo = 'buleria-6';				// Default rhythm style
var tempo =  parseInt($('#' + palo + ' .tempo').val()) / 2; // Set default tempo
var masterVolume = parseInt($('#' + palo + " .masterVolume").val()); // Set default master volume
var lookahead = 25.0;       		// How frequently to call scheduling function 
                            		//(in milliseconds)
var scheduleAheadTime = 0.1;    	// How far ahead to schedule audio (sec)
                            		// This is calculated from lookahead, and overlaps 
                            		// with next interval (in case the timer is late)
var nextNoteTime = 0.0;     		// when the next note is due.
var noteResolution = 0;     		// 0 = counter times, 1 = times only
var clapType = 0;					// Default clap = light claps
var notesInQueue = [];      		// the notes that have been put into the web audio,
                            		// and may or may not have played yet. {note, time}
var timerWorker = null;     		// The Web Worker used to fire timer messages

var numberOfTimes = 12;				// Default rhythm times
var container = $('svg.visualizer');// Select the drawing svg container

// List of all the palos' slugs
var palos = [
    "buleria-6",
    "buleria-12",
    "solea",
    "siguiriya",
    "fandangos",
    "tangos",
    "rumba"
];

// Set functions
function playSound(buffer, start, vol, callback) {
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

    callback && callback();
};

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
    if ( (noteResolution==1) && (beatNumber%2) ) {
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
    isPlaying = !isPlaying;

    var playButton = $('.play > .glyphicon');

    // start playing
    if (isPlaying) { 

        currentNote = 0;
        nextNoteTime = audioContext.currentTime;

        // change play button
        playButton.removeClass('glyphicon-play').addClass('glyphicon-stop');
        $('.play').toggleClass('active');

        // Send message to worker
        timerWorker.postMessage("start");
        return "stop";

	// stop playing
    } else { 

        // change play button
        playButton.removeClass('glyphicon-stop').addClass('glyphicon-play');
        $('.play').toggleClass('active');

        // Send message to worker
        timerWorker.postMessage("stop");
        return "play";

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
    $(".visualizer_div").html($(".visualizer_div").html());
    console.log('drawn visualizer');

}

function resetDraw() {
	// Erase svg and draw again
    container.contents().remove();
    draw();
}

// *************************************************************************
// *************************************************************************
// On document ready, load buttons, tempo and volume values, init() function
// *************************************************************************
// *************************************************************************

$(document).ready(function() {
	// Create Web Audio API audio context
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	audioContext = new AudioContext();

	// Prepare loading sounds
    var format = '.' + (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');

    function loadSoundObj(obj, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', obj.src + format, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            // request.response is encoded... so decode it now
            audioContext.decodeAudioData(request.response, function(buffer) {
                obj.buffer = buffer;
                callback && callback();
            }, function() {
                message.call($wrapper, 'error', 'Error loading ' + obj.src);
            });
        }

        request.send();
    }

    function loadSounds(obj, callback) {
        var len = obj.length, i;

        // iterate over sounds obj
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                // load sound
                loadSoundObj(obj[i], callback);
            }
        }
    }

    // Declare sounds object
    sounds = {
        clara_1 : {
            src : 'audio/clara_1',
            volume : 1
        },
        clara_2 : {
            src : 'audio/clara_2',
            volume : 1
        },
        clara_3 : {
            src : 'audio/clara_3',
            volume : 0.5
        },
        sorda_1 : {
            src : 'audio/sorda_1',
            volume : 1
        },
        sorda_2 : {
            src : 'audio/sorda_2',
            volume : 1
        },
        udu_1 : {
            src : 'audio/udu_1',
            volume : 1
        },
        udu_2 : {
            src : 'audio/udu_2',
            volume : 0.5
        }
    }; 

    // Load sounds
    loadSounds(sounds);

    // Set the message worker
    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
//            console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});

    // Load svg
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

    	if (isPlaying = true) {
    		play();
    	} 

    	// Set rhythm style
        palo = $(e.target).attr('aria-controls');

        // Reset options
        noteResolution = 0;
        clapType = 0;

        // Select the drawing svg container
		container = $('svg.visualizer'); 

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
	$.each(palos, function(paloIndex, paloSlug) {
	    $('#' + paloSlug + ' .masterVolume').knob({
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
    
    $(window).on("orientationchange", resetDraw);
    $(window).on("resize", resetDraw); 

});

