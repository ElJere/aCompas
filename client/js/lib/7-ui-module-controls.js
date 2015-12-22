// Create a window.aCompas.ui module
var controlsModule = {

    // Play button
    play: {
        initialize: function(cssSelector) {
            var html = "";
            html += "<button class=\"btn-play\">";
            html += "<i class=\"mdi mdi-play\"></i>";
            html += "</button>";
            $(cssSelector).html(html);
        }
    },

    // Resolution switch
    resolution: {
        initialize: function(cssSelector) {
            var html = "";
            html += "<div class=\"resolution\">";
            html += "<div>";
            html += "<i class=\"mdi mdi-music-note mdi-24px\"></i>";
            html += "</div>";
            html += "<div class=\"switch\">";
            html += "<label>";
            html += "Off";
            html += "<input type=\"checkbox\" checked />";
            html += "<span class=\"lever\"></span>";
            html += "On";
            html += "</label>";
            html += "</div>";
            html += "</div>";
            $(cssSelector).html(html);
            window.aCompas.audioEngine.setResolution(true);
        }
    },

    // Click switch
    click: {
        initialize: function(cssSelector) {
            var html = "";
            html += "<div class=\"click\">";
            html += "<div>";
            html += "Click";
            html += "</div>";
            html += "<div class=\"switch\">";
            html += "<label>";
            html += "Off";
            html += "<input type=\"checkbox\" />";
            html += "<span class=\"lever\"></span>";
            html += "On";
            html += "</label>";
            html += "</div>";
            html += "</div>";
            $(cssSelector).html(html);
            window.aCompas.audioEngine.setClickEnabled(false);
        }
    },

    tempo: {
        initialize: function(cssSelector) {
            var initialValue = 140; // BPM
            // Grab the buttons' color using JS for the knob
            var color = $(".btn").css("background-color");
            // Build knob
            var html = "";
            html += "<div>Tempo (bpm)</div>";
            html += "<input type=\"text\" value=\"" + initialValue
                + "\" data-min=\"1\" data-max=\"500\" data-width=\"100\" data-height=\"100\" "
                + "data-fgColor=\"" + color + "\" />";
            $(cssSelector).html(html);
            $(cssSelector + " input[type=text]").knob({
                change: function(value) {
                    window.aCompas.audioEngine.setTempo(value);
                },
                release: function(value) {
                    window.aCompas.audioEngine.setTempo(value);
                }
            });
            window.aCompas.audioEngine.setTempo(initialValue);
        }
    },

    volume: {
        initialize: function(cssSelector) {
            var defaultVolume = 90;
            // Grab the buttons' color using JS for the knob
            var color = $(".btn").css("background-color");
            // Build knob
            var html = "";
            html += "<div>Volume (%)</div>";
            html += "<input type=\"text\" value=\"" + defaultVolume + "\" data-min=\"0\" "
                + "data-max=\"100\" data-width=\"100\" data-height=\"100\" "
                + "data-fgColor=\"" + color + "\" />";
            $(cssSelector).html(html);
            $(cssSelector + " input[type=text]").knob({
                change: function(value) {
                    window.aCompas.audioEngine.setVolume(value);
                },
                release: function(value) {
                    window.aCompas.audioEngine.setVolume(value);
                }
            });
            window.aCompas.audioEngine.setVolume(defaultVolume);
        }
    }


}

window.aCompas.ui.registerModule("controls", controlsModule);

$(document).on("click", ".btn-play", function(e) {
    e.preventDefault();
    if (window.aCompas.audioEngine.getIsPlaying()) {
        $(".btn-play i.mdi").removeClass("mdi-stop").addClass("mdi-play");
    } else {
        $(".btn-play i.mdi").removeClass("mdi-play").addClass("mdi-stop");
    }
    window.aCompas.audioEngine.playPause();
});

$(document).on("change", ".click .switch input[type=checkbox]", function(e) {
    var checkbox = $(this);
    window.aCompas.audioEngine.setClickEnabled(checkbox.is(":checked"))
});

$(document).on("change", ".resolution .switch input[type=checkbox]", function(e) {
    var checkbox = $(this);
    window.aCompas.audioEngine.setResolution(checkbox.is(":checked"))
});
