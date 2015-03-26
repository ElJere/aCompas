/**
 * Buleria (12)
 */

function scheduleNoteBuleria12(clapType, beatNumber, sounds, time) {
	// Use the same function as for Solea
	scheduleNoteSolea(clapType, beatNumber, sounds, time);
}

function drawBuleria12(i, bar, container) {
	// Use the same function as for Solea
	drawSolea(i, bar, container);
}


$(document).ready(function() {
    // Set tempo button
    $('#buleria-12 .tempo').knob({
        width:104,
        height:104,
        min:30,
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
            var _txtDiv = $('#buleria-12 .text-danger');

            if ( v >= 230 ) {
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
    // Set volume button
    $('#buleria-12 .masterVolume').knob({
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
