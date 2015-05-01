/**
 * Common functions which are used for each palo
 */

function drawBarsAndNumbers(bar, number, i) {
    // Draw bars
    var rect = paper.rect(bar.x, bar.y, bar.width, bar.height);
    rect.attr({ fill: "tomato" });
    rect.node.setAttribute("class", "bar bar_" + i);

    // Draw numbers
    var text = null;
    if ( number !== null ) {
        text = paper.text((bar.x + bar.width / 2.1), (bar.y + 25), number);
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

function setUpBeat(elts) {
    elts.rect.attr("fill", "firebrick");
    elts.rect.attr("stroke", "firebrick");
    elts.text.attr("fill", "black");
}

function setDownBeat(elts) {
    elts.rect.attr({ stroke: "tomato" });
}

function animateStrongBeat(i) {
    $('.bar_' + i)
        .velocity({ y: 5, height: [250, 300]}, {duration: 0, easing: "linear"})
        .velocity({ y: 250, height: 5}, {duration: 500, easing: "linear"});
}

function animateUpBeat(i) {
    $('.bar_' + i)
        .velocity({ y: 55, height: [200, 250]}, {duration: 0, easing: "linear"})
        .velocity({ y: 250, height: 5}, {duration: 500, easing: "linear"});
}

function animateDownBeat(i) {
    $('.bar_' + i)
        .velocity({ y: 155, height: [100, 150]}, {duration: 0, easing: "linear"})
        .velocity({ y: 250, height: 5}, {duration: 500, easing: "linear"});
}

/**
 * Buleria (12)
 */

function scheduleNoteBuleria12(clapType, beatNumber, sounds, time) {
    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
    // solea :      1   2   3   4   5   6     7     8     9     10    11    12   
    if (clapType === 0) { // Palmas claras
        if (beatNumber === 0) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 1) {
            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
        } else if (beatNumber === 2) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 4) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        } else if (beatNumber === 6) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 7) {
            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
        } else if (beatNumber === 8) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 10) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 12) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        } else if (beatNumber === 13) {
            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
        } else if (beatNumber === 14) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        } else if (beatNumber === 16) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 17) {
            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
        } else if (beatNumber === 18) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        } else if (beatNumber === 20) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 22) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        }
    } else { // Palmas sordas
        if (beatNumber === 0) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 1) {
            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
        } else if (beatNumber === 2) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 4) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        } else if (beatNumber === 6) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 7) {
            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
        } else if (beatNumber === 8) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 10) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 12) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        } else if (beatNumber === 13) {
            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
        } else if (beatNumber === 14) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        } else if (beatNumber === 16) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 17) {
            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
        } else if (beatNumber === 18) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        } else if (beatNumber === 20) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 22) {
            playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        }           
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 4 || beatNumber === 12 || beatNumber === 14 || beatNumber === 18 || beatNumber === 22 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawBuleria12(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = i + 1;
    } else if ( i % 2 === 0 ) {
        number = i - ( (i / 2) - 1);
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 4 || i === 12 || i === 14 || i === 18 || i === 22 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}


/**
 * Buleria (6)
 */

function scheduleNoteBuleria6(clapType, beatNumber, sounds, time) {
    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11
    // buleria :    6   1   2   3   4   5    
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    	} else if (beatNumber === 1 ) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 2) { 
            playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
        } else if (beatNumber === 3) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
            playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
        } else if (beatNumber === 4) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 6) {
            playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
        } else if (beatNumber === 7) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 8) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        } else if (beatNumber === 9) {
            playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
        } else if (beatNumber === 10) {
            playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
        }
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 1 ) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 2) { 
            playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
        } else if (beatNumber === 3) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 4) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 6) {
            playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
        } else if (beatNumber === 7) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 8) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        } else if (beatNumber === 10) {
            playSound(sounds.sorda_2.buffer, time, 0.3);
        }
    }
    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 0 || beatNumber == 6 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawBuleria6(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = 6;
    } else if (i % 2 === 0) {
        number = i / 2;
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 0 || i === 6 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}


/**
 * Fandangos
 */

function scheduleNoteFandangos(clapType, beatNumber, sounds, time) {
    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
    // fandangos :  1   2   3   4   5   6     7     8     9     10    11    12   
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber == 8) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 13) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 15) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 16) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 18) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 19) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 20) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 22) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	}
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 3) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 6) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 10) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 12) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 13) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 15) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 16) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 18) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 19) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 20) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 22) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	}
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 4 || beatNumber === 10 || beatNumber === 14 || beatNumber === 18 || beatNumber === 22 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawFandangos(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = i + 1;
    } else if ( i % 2 === 0) {
        number = i - ( (i / 2) - 1);
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 0 || i === 6 || i === 12 || i === 18 || i === 20 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}

/**
 * Rumba
 */

function scheduleNoteRumba(clapType, beatNumber, sounds, time) {
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 5) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 9) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 11) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 13) {
//    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 15) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	}
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 3) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 4) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 5) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 7) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 8) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 9) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 11) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 12) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 13) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 15) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	}
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 0 || beatNumber === 4 || beatNumber === 8 || beatNumber === 12 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawRumba(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = i + 1;
    } else if (i % 2 === 0) {
        number = i - ( (i / 2) - 1);
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 0 || i === 4 || i === 8 || i === 12) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}


/**
 * Siguiriya
 */

function scheduleNoteSiguiriya(clapType, beatNumber, sounds, time) {
    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
    // siguiriya : 	1       2       3               4                  5        
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 5) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 9) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 11) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 13) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 15) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 16) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 17) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 18) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 19) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 20) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 22) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	}
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 2) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 4) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 5) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 6) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 8) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 9) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 10) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 11) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 13) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 14) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 15) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 16) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 17) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 18) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 19) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 20) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 22) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	}	    	
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 0 || beatNumber === 4 || beatNumber === 8 || beatNumber === 14 || beatNumber === 20 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawSiguiriya(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = 1;
    } else if ( i === 4 ) {
        number = 2;
    } else if ( i === 8 ) {
        number = 3;
    } else if ( i === 14 ) {
        number = 4;
    } else if ( i === 20 ) {
        number = 5;
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 0 || i === 4 || i === 8 || i === 14 || i === 20 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}


/**
 * Solea
 */

function scheduleNoteSolea(clapType, beatNumber, sounds, time) {
    // beatNumber : 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 
    // solea : 	    1   2   3   4   5   6     7     8     9     10    11    12   
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 7) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 13) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 16) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 17) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 18) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 20) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 22) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	}
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 1) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 4) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 7) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 10) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 13) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 16) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 17) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 18) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 20) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 22) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	}	    	
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 4 || beatNumber === 10 || beatNumber === 14 || beatNumber === 18 || beatNumber === 22 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawSolea(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = i + 1;
    } else if (i % 2 === 0) {
        number = i - ( (i / 2) - 1);
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 4 || i === 10 || i === 14 || i === 18 || i === 22 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}


/**
 * Tangos
 */

function scheduleNoteTangos(clapType, beatNumber, sounds, time) {
    // beatNumber : TODO
    // tangos : TODO
    if (clapType === 0) { // Palmas claras
    	if (beatNumber === 0) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 1) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 2) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 6) {
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.udu_1.buffer, time, sounds.udu_1.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 9) {
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 10) {
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	} else if (beatNumber === 11) {
    		playSound(sounds.udu_2.buffer, time, sounds.udu_2.volume);
    		playSound(sounds.clara_3.buffer, time, sounds.clara_3.volume);
    	} else if (beatNumber === 12) {
    		playSound(sounds.clara_2.buffer, time, sounds.clara_2.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.clara_1.buffer, time, sounds.clara_1.volume);
    	}
    } else { // Palmas sordas
    	if (beatNumber === 0) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 1) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 2) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 3) {
    		playSound(sounds.sorda_2.buffer, time, sounds.sorda_2.volume);
    	} else if (beatNumber === 4) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 6) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 8) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 9) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 10) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 11) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	} else if (beatNumber === 12) {
    		playSound(sounds.sorda_1.buffer, time, sounds.sorda_1.volume);
    	} else if (beatNumber === 14) {
    		playSound(sounds.sorda_2.buffer, time, 0.3);
    	}
    }

    // On playing sounds, animate bars
    for ( var i = 0; i <= beatNumber; i++ ) {
        if ( i === beatNumber ) {
            if ( beatNumber === 4 || beatNumber === 10 || beatNumber === 14 || beatNumber === 18 || beatNumber === 22 ) {
                animateStrongBeat(i);
            } else if ( beatNumber % 2 === 0 ) {
                animateUpBeat(i);
            } else {
                animateDownBeat(i);
            }
        }
    }
}

function drawTangos(i, bar) {
    var number = null;
    if ( i === 0 ) {
        number = i + 1;
    } else if ( i % 2 === 0 ){
        number = i - ( (i / 2) - 1);
    }
    var elts = drawBarsAndNumbers(bar, number, i);
    if ( i === 0 || i === 8 ) {
        setUpBeat(elts);
    } else {
        setDownBeat(elts);
    }
}
