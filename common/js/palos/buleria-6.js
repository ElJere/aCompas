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
    for ( var j = 0; j <= beatNumber; j++ ) {
        if ( j === beatNumber ) {
            if ( beatNumber === 0 || beatNumber == 6 ) {
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

function drawBuleria6(i, bar, container) {
	var number = null;
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
    if ( i === 0 || i === 6 ) {
        $('.bar_' + i).attr('fill', 'firebrick');
        $('.number_' + i).attr('fill', 'black');
    }
}

function initBuleria6() {
    // Set tempo button
    $('#buleria-6 .tempo').knob({
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
        release:function (v) {
			tempo = v / 2;
			console.log('new tempo = ' + (v / 2) );
            var _txt = null;
            var _txtDiv = $('#buleria-6 .text-danger');

            if ( v >= 270 ) {
            	_txt = "Your rhythm is very fast ...";
            	if ( _txtDiv.css('opacity') == 0 ) {
            		_txtDiv.append(_txt);
            		_txtDiv.animate({'opacity': '1'}, 300);
            	} else {
            		_txtDiv.empty().append("Info : ");
            		_txtDiv.append(_txt);
            	}
            } else if ( v <= 120 ) {
            	_txt = "Your rhythm is very slow ...";
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
}
