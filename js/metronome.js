// Set variables
var audioContext = null;
var isPlaying = false;      		// Are we currently playing?
var startTime;              		// The start time of the entire sequence.
var currentNote;        			// What note is currently last scheduled?
var tempo = $('.tempo').val() / 2;	// Set default tempo
var masterVolume = 80;				// Set default master volume
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

var palo = 'buleria';				// Default rhythm style

var numberOfTimes = 12;				// Default rhythm times
var container = $('svg.visualizer');// Select the drawing svg container

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

    // **********************
    // **********************
    // compose buleria rhythm
    // **********************
    // **********************

    if (palo == 'buleria') {
	    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11
	    // buleria :    6   1   2   3   4   5    
	    if (clapType == 0) { // Palmas claras
	    	if (beatNumber == 0) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    	} else if (beatNumber == 1 ) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 2) { 
	            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	        } else if (beatNumber == 3) {
	            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	            playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	        } else if (beatNumber == 4) {                      
	            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	        } else if (beatNumber == 6) {
	            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	        } else if (beatNumber == 7) {                      
	            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	        } else if (beatNumber == 8) {                      
	            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	        } else if (beatNumber == 9) {                      
	            playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	        } else if (beatNumber == 10) {                      
	            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	        }
	    } else { // Palmas sordas
	    	if (beatNumber == 0) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 1 ) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 2) { 
	            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	        } else if (beatNumber == 3) {
	            playSound(sounds.sorda_2.buffer, time, 0.3);
	        } else if (beatNumber == 4) {                      
	            playSound(sounds.sorda_2.buffer, time, 0.3);
	        } else if (beatNumber == 6) {
	            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	        } else if (beatNumber == 7) {                      
	            playSound(sounds.sorda_2.buffer, time, 0.3);
	        } else if (beatNumber == 8) {                      
	            playSound(sounds.sorda_2.buffer, time, 0.3);
	        } else if (beatNumber == 10) {                    
	            playSound(sounds.sorda_2.buffer, time, 0.3);
	        }	    	
	    }

	    // On playing sounds, animate bars
	    for ( var j = 0; j <= beatNumber; j++ ) {
	        if ( j == beatNumber ) {
	            if ( beatNumber == 0 || beatNumber == 6 ) {
	                $('.bar_' + j)
	                .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
	                .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
	            } else if ( beatNumber % 2 === 0 ) {
	                $('.bar_' + j)
	                .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
	                .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                   
	            } else {
	                $('.bar_' + j)
	                .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
	                .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
	            }
	        }
	    }

	// ********************
	// ********************
	// Compose solea rhythm
	// ********************
	// ********************

	} else if ( palo == 'solea' ) {
	    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
	    // solea : 	    1   2   3   4   5   6     7     8     9     10    11    12   
	    if (clapType == 0) { // Palmas claras
	    	if (beatNumber == 0) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 17) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	}
	    } else { // Palmas sordas
	    	if (beatNumber == 0) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 17) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	}	    	
	    }

        // On playing sounds, animate bars
        for ( var j = 0; j <= beatNumber; j++ ) {
            if ( j == beatNumber ) {
                if ( beatNumber == 4 || beatNumber == 10 || beatNumber == 14 || beatNumber == 18 || beatNumber == 22 ) {
                    $('.bar_' + j)
                    .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                } else if ( beatNumber % 2 === 0 ) {
                    $('.bar_' + j)
                    .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                   
                } else {
                    $('.bar_' + j)
                    .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                }
            }
        }

    // ************************
    // ************************
	// Compose siguiriya rhythm
	// ************************
	// ************************

	} else if ( palo == 'siguiriya' ) {
	    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
	    // siguiriya : 	1       2       3               4                  5        
	    if (clapType == 0) { // Palmas claras
	    	if (beatNumber == 0) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 5) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 9) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 11) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 15) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 17) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 19) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	}
	    } else { // Palmas sordas
	    	if (beatNumber == 0) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 5) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 9) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 11) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 15) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 17) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 19) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	}	    	
	    }

        // On playing sounds, animate bars
        for ( var j = 0; j <= beatNumber; j++ ) {
            if ( j == beatNumber ) {
                if ( beatNumber == 0 || beatNumber == 4 || beatNumber == 8 || beatNumber == 14 || beatNumber == 20 ) {
                    $('.bar_' + j)
                    .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                } else if ( beatNumber % 2 === 0 ) {
                    $('.bar_' + j)
                    .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                   
                } else {
                    $('.bar_' + j)
                    .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                }
            }
        }

    // ************************
    // ************************
	// Compose fandangos rhythm
	// ************************
	// ************************

	} else if ( palo == 'fandangos' ) {
	    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
	    // fandangos :  1   2   3   4   5   6     7     8     9     10    11    12   
	    if (clapType == 0) { // Palmas claras
	    	if (beatNumber == 0) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 15) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 19) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	}
	    } else { // Palmas sordas
	    	if (beatNumber == 0) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 7) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 13) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 15) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 16) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 18) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 19) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 20) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 22) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	}
	    }

        // On playing sounds, animate bars
        for ( var j = 0; j <= beatNumber; j++ ) {
            if ( j == beatNumber ) {
                if ( beatNumber == 4 || beatNumber == 10 || beatNumber == 14 || beatNumber == 18 || beatNumber == 22 ) {
                    $('.bar_' + j)
                    .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                } else if ( beatNumber % 2 === 0 ) {
                    $('.bar_' + j)
                    .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                   
                } else {
                    $('.bar_' + j)
                    .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                }
            }
        }

    // *********************
    // *********************
	// Compose tangos rhythm
	// *********************
	// *********************

	} else if ( palo == 'tangos' ) {
	    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15  
	    // solea : 	    1   2   3   4   5   6     7     8        
	    if (clapType == 0) { // Palmas claras
	    	if (beatNumber == 0) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 9) {
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	} else if (beatNumber == 11) {
	    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
	    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
	    	}
	    } else { // Palmas sordas
	    	if (beatNumber == 0) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 1) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 2) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 3) {
	    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
	    	} else if (beatNumber == 4) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 6) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 8) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 9) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 10) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 11) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	} else if (beatNumber == 12) {
	    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
	    	} else if (beatNumber == 14) {
	    		playSound(sounds.sorda_2.buffer, time, 0.3);
	    	}
	    }

        // On playing sounds, animate bars
        for ( var j = 0; j <= beatNumber; j++ ) {
            if ( j == beatNumber ) {
                if ( beatNumber == 4 || beatNumber == 10 || beatNumber == 14 || beatNumber == 18 || beatNumber == 22 ) {
                    $('.bar_' + j)
                    .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                } else if ( beatNumber % 2 === 0 ) {
                    $('.bar_' + j)
                    .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                   
                } else {
                    $('.bar_' + j)
                    .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
                    .velocity({  y: 250,height: 5}, {duration: 500, easing: "linear"});                 
                }
            }
        }
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

        if ( palo == 'buleria' ) {

			if ( i === 0 ) {
				number = 6;
			} else {
				number = i / 2;
			}

			// Draw bars
			container.append('<rect class="bar bar_' + i + '" x=' + bar.x + ' y=' + bar.y + ' fill="' + bar.fill + '" width=' + bar.width + ' height=' + bar.height + '/>');

			// Draw numbers
            if ( i % 2 === 0 ) {
		        container.append('<text class="number number_' + i + '" x=' + (bar.x + bar.width / 2.2) + ' y=' + (bar.y + 25) + ' fill="lightgray" font-size="16" font-family="sans-serif" font-weight="bold">' + number + '</text>');
            }

            // Set styles
            if ( i == 0 || i == 6 ) {
                $('.bar_' + i).attr('fill', 'firebrick');
                $('.number_' + i).attr('fill', 'black');
            }

        } else if ( palo == 'solea' ) {

			if ( i === 0 ) {
				number = i + 1;
			} else {
				number = i - ( (i / 2) - 1);
			}

			// Draw bars
			container.append('<rect class="bar bar_' + i + '" x=' + bar.x + ' y=' + bar.y + ' fill="' + bar.fill + '" width=' + bar.width + ' height=' + bar.height + '/>');

			// Draw numbers
            if ( i % 2 === 0 ) {
                container.append('<text class="number number_' + i + '" x=' + (bar.x + bar.width / 2.2) + ' y=' + (bar.y + 25) + ' fill="lightgray" font-size="16" font-family="sans-serif" font-weight="bold">' + number + '</text>');
            }

            // Set styles
            if ( i == 4 || i == 10 || i == 14 || i == 18 || i == 22 ) {
                $('.bar_' + i).attr('fill', 'firebrick');
                $('.number_' + i).attr('fill', 'black');
            }

        } else if ( palo == 'siguiriya' ) {

			if ( i == 0 ) {
				number = 1;
			} else if ( i == 4 ) {
				number = 2;
			} else if ( i == 8 ) {
				number = 3;
			} else if ( i == 14 ) {
				number = 4;
			} else if ( i == 20 ) {
				number = 5;
			}

			// Draw bars
			container.append('<rect class="bar bar_' + i + '" x=' + bar.x + ' y=' + bar.y + ' fill="' + bar.fill + '" width=' + bar.width + ' height=' + bar.height + '/>');

			// Draw numbers
            // Set styles
            if ( i == 0 || i == 4 || i == 8 || i == 14 || i == 20 ) {
                container.append('<text class="number number_' + i + '" x=' + (bar.x + bar.width / 2.2) + ' y=' + (bar.y + 25) + ' fill="lightgray" font-size="16" font-family="sans-serif" font-weight="bold">' + number + '</text>');
                $('.bar_' + i).attr('fill', 'firebrick');
                $('.number_' + i).attr('fill', 'black');
            }

        } else if ( palo == 'fandangos' ) {

			if ( i === 0 ) {
				number = i + 1;
			} else {
				number = i - ( (i / 2) - 1);
			}

			// Draw bars
			container.append('<rect class="bar bar_' + i + '" x=' + bar.x + ' y=' + bar.y + ' fill="' + bar.fill + '" width=' + bar.width + ' height=' + bar.height + '/>');

			// Draw numbers
            if ( i % 2 === 0 ) {
                container.append('<text class="number number_' + i + '" x=' + (bar.x + bar.width / 2.2) + ' y=' + (bar.y + 25) + ' fill="lightgray" font-size="16" font-family="sans-serif" font-weight="bold">' + number + '</text>');
            }

            // Set styles
            if ( i == 0 || i == 6 || i == 12 || i == 18 || i == 20 ) {
                $('.bar_' + i).attr('fill', 'firebrick');
                $('.number_' + i).attr('fill', 'black');
            }

        } else if ( palo == 'tangos' ) {

			if ( i === 0 ) {
				number = i + 1;
			} else {
				number = i - ( (i / 2) - 1);
			}

			// Draw bars
			container.append('<rect class="bar bar_' + i + '" x=' + bar.x + ' y=' + bar.y + ' fill="' + bar.fill + '" width=' + bar.width + ' height=' + bar.height + '/>');

			// Draw numbers
            if ( i % 2 === 0 ) {
                container.append('<text class="number number_' + i + '" x=' + (bar.x + bar.width / 2.2) + ' y=' + (bar.y + 25) + ' fill="lightgray" font-size="16" font-family="sans-serif" font-weight="bold">' + number + '</text>');
            }

            // Set styles
            if ( i == 0 || i == 8 ) {
                $('.bar_' + i).attr('fill', 'firebrick');
                $('.number_' + i).attr('fill', 'black');
            }

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
            console.log("tick!");
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

    // Set buleria buttons
    $('#buleria .tempo').knob({
        width:104,
        height:104,
        min:60,
        max:300,
        step:1,
        angleArc:360,
        displayInput:true,
        thickness:'.2',
        inputColor:'#777',
        font:'arial',
        fontWeight:'normal',
        fgColor:'tomato',
        change:function (v) { 
            tempo = v / 2;
            console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#buleria .text-danger');

            if ( v >= 270 ) {
            	_txt = "Your rhythm is very quick...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v <= 120 ) {
            	_txt = "Your rhythm is very slow...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else {
            	if ( _txtDiv.css('opacity') == 1 ) {
            		_txtDiv.animate({'opacity': '0'}, 300, function() {
            			_txtDiv.empty().append("Info : ");
            		});
            	}
            	
            }
        }
    });

    $('#buleria .masterVolume').knob({
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
        change:function (v) { 
            masterVolume = v;
            console.log('new masterVolume = ' + v);
        }
    });

    // Set solea buttons
    $('#solea .tempo').knob({
        width:104,
        height:104,
        min:30,
        max:220,
        step:1,
        angleArc:360,
        displayInput:true,
        thickness:'.2',
        inputColor:'#777',
        font:'arial',
        fontWeight:'normal',
        fgColor:'tomato',
        change:function (v) { 
            tempo = v / 2;
            console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#solea .text-danger');

            if ( v >= 180 ) {
            	_txt = "Your rhythm is very quick...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v >= 120 && v <= 180 ) {
             	_txt = "Your tempo is solea por buleria or alegria";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}           	
            } else if ( v <= 60 ) {
            	_txt = "Your rhythm is very slow...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else {
            	if ( _txtDiv.css('opacity') == 1 ) {
            		_txtDiv.animate({'opacity': '0'}, 300, function() {
            			_txtDiv.empty().append("Info : ");
            		});
            	}
            	
            }
        }
    });

    $('#solea .masterVolume').knob({
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
        change:function (v) { 
            masterVolume = v;
            console.log('new masterVolume = ' + v);
        }
    });

    // Set siguiriya buttons
    $('#siguiriya .tempo').knob({
        width:104,
        height:104,
        min:20,
        max:180,
        step:1,
        angleArc:360,
        displayInput:true,
        thickness:'.2',
        inputColor:'#777',
        font:'arial',
        fontWeight:'normal',
        fgColor:'tomato',
        change:function (v) { 
            tempo = v / 2;
            console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#siguiriya .text-danger');

            if ( v >= 160 ) {
            	_txt = "Your rhythm is very quick...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v <= 60 ) {
            	_txt = "Your rhythm is very slow...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else {
            	if ( _txtDiv.css('opacity') == 1 ) {
            		_txtDiv.animate({'opacity': '0'}, 300, function() {
            			_txtDiv.empty().append("Info : ");
            		});
            	}
            	
            }            
        }
    });

    $('#siguiriya .masterVolume').knob({
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
        change:function (v) { 
            masterVolume = v;
            console.log('new masterVolume = ' + v);
        }
    });

    // Set fandangos buttons
    $('#fandangos .tempo').knob({
        width:104,
        height:104,
        min:30,
        max:250,
        step:1,
        angleArc:360,
        displayInput:true,
        thickness:'.2',
        inputColor:'#777',
        font:'arial',
        fontWeight:'normal',
        fgColor:'tomato',
        change:function (v) { 
            tempo = v / 2;
            console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#fandangos .text-danger');

            if ( v >= 200 ) {
            	_txt = "Your rhythm is very quick...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v <= 90 ) {
            	_txt = "Your rhythm is very slow...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else {
            	if ( _txtDiv.css('opacity') == 1 ) {
            		_txtDiv.animate({'opacity': '0'}, 300, function() {
            			_txtDiv.empty().append("Info : ");
            		});
            	}
            	
            }    
        }
    });

    $('#fandangos .masterVolume').knob({
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
        change:function (v) { 
            masterVolume = v;
            console.log('new masterVolume = ' + v);
        }
    });

    // Set tangos buttons
    $('#tangos .tempo').knob({
        width:104,
        height:104,
        min:30,
        max:250,
        step:1,
        angleArc:360,
        displayInput:true,
        thickness:'.2',
        inputColor:'#777',
        font:'arial',
        fontWeight:'normal',
        fgColor:'tomato',
        change:function (v) { 
            tempo = v / 2;
            console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#tangos .text-danger');

            if ( v >= 180 ) {
            	_txt = "Your rhythm is por rumba";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v <= 90 ) {
            	_txt = "Your rhythm is por tientos";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else {
            	if ( _txtDiv.css('opacity') == 1 ) {
            		_txtDiv.animate({'opacity': '0'}, 300, function() {
            			_txtDiv.empty().append("Info : ");
            		});
            	}
            	
            }         
        }
    });

    $('#tangos .masterVolume').knob({
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
        change:function (v) { 
            masterVolume = v;
            console.log('new masterVolume = ' + v);
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
		if ( palo == 'buleria' ) {
			tempo = $('#buleria .tempo').val() / 2;
			numberOfTimes = 12;
		} else if ( palo == 'solea' ) {
			tempo = $('#solea .tempo').val() / 2;
			numberOfTimes = 24;
		} else if ( palo == 'siguiriya' ) {
			tempo = $('#siguiriya .tempo').val() / 2;
			numberOfTimes = 24;
		} else if ( palo == 'fandangos' ) {
			tempo = $('#fandangos .tempo').val() / 2;
			numberOfTimes = 24;
		} else if ( palo == 'tangos' ) {
			tempo = $('#tangos .tempo').val() / 2;
			numberOfTimes = 16;
		}

        console.log('tab shown : ' + palo + ', tempo : ' + tempo);

        // Reset svg
        resetDraw();

    });

    $(window).on("orientationchange", resetDraw);
    $(window).on("resize", resetDraw); 

});

