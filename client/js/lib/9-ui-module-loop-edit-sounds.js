// Create a window.aCompas.ui module
var loopEditSoundsModule = {

    initializeInstrumentsCollapsible: function() {
        var html = "";
        $(window.aCompas.instruments).each(function(instrumentIndex, instrumentData) {
            if (instrumentData.slug !== "click") {
                html += "<li data-instrument=\"" + instrumentData.slug + "\">";
                html += "<div class=\"collapsible-header\">";
                html += "<i class=\"mdi mdi-music-circle\"></i> " + instrumentData.label;
                html += "</div>";
                html += "<div class=\"collapsible-body\">";
                html += "<div class=\"row\">";
                html += "<div class=\"col s12\">";
                html += "<input type=\"checkbox\" id=\"solo-" + instrumentData.slug
                    + "\" class=\"solo\" />";
                html += "<label for=\"solo-" + instrumentData.slug
                    + "\" class=\"label-solo\">Solo</label>";
                html += "<input type=\"checkbox\" id=\"mute-" + instrumentData.slug
                    + "\" class=\"mute\" />";
                html += "<label for=\"mute-" + instrumentData.slug
                    + "\" class=\"label-mute\">Mute</label>";
                html += "</div>"
                html += "</div>";
                html += "<div class=\"row\">";
                html += "<div class=\"col s12\">";
                $(window.aCompas.sounds[instrumentData.slug]).each(function(soundIndex, soundData) {
                    html += "<div class=\"row\">";
                    html += "<div class=\"col s3 m2 l1\">";
                    html += soundData.label;
                    html += "</div>";
                    html += "<div class=\"col s9 m10 l11 sound-occurrences\" data-sound-id=\""
                        + soundData.id + "\">";
                    html += "<i class=\"mdi mdi-information\"></i> <i>Empty "
                        + "rhythmic structure !</i> First, define your loop's "
                        + "rhythmic structure in order to be able to add sound "
                        + "occurrences.";
                    html += "</div>";
                    html += "</div>";
                });
                html += "</div>";
                html += "</div>";
                html += "</div>";
                html += "</li>";
            }
        });
        $("#loop-edit #instruments ul.collapsible").html(html);
        $("#loop-edit #instruments ul.collapsible").collapsible();
    },

    appendEighthNotes: function(nbEighthNotesToAppend) {
        var module = this;
        var oldNbEighthNotes = $("#loop-edit #instruments").data("nb-eighth-notes");
        if (oldNbEighthNotes === undefined) {
            oldNbEighthNotes = 0;
            // Delete default message which is shown when the rhythmic structure
            // is not yet defined.
            $("#loop-edit #instruments .sound-occurrences").html("");
        }
        $(window.aCompas.instruments).each(function(instrumentIndex, instrumentData) {
            $(window.aCompas.sounds[instrumentData.slug]).each(function(soundIndex, soundData) {
                var html = "";
                for (var i = 0; i < nbEighthNotesToAppend; i++) {
                    var newEightNoteIndex = oldNbEighthNotes + i;
                    html += "<span class=\"sound-occurrence-container\" data-index=\""
                        + newEightNoteIndex + "\">";
                    html += "<input type=\"checkbox\" id=\"sound-occurrence-"
                        + soundData.id + "-" + newEightNoteIndex + "\" />";
                    html += "<label for=\"sound-occurrence-" + soundData.id
                        + "-" + newEightNoteIndex + "\"></label>";
                    html += "</span>";
                }
                $("#loop-edit #instruments li[data-instrument="
                    + instrumentData.slug + "] .sound-occurrences[data-sound-id="
                    + soundData.id + "]").append(html);
            });
        });
        $("#loop-edit #instruments").data("nb-eighth-notes", oldNbEighthNotes + nbEighthNotesToAppend);
        module.updateAudioEngineLoopDefinition();
    },

    truncateEighthNotes: function(nbEighthNotesToDelete) {
        var module = this;
        var oldNbEighthNotes = $("#loop-edit #instruments").data("nb-eighth-notes");
        for (var i = 0; i < nbEighthNotesToDelete; i++) {
            var indexToRemove = oldNbEighthNotes - i -1;
            $("#loop-edit #instruments .sound-occurrence-container[data-index="
                + indexToRemove + "]").remove();
        }
        $("#loop-edit #instruments").data("nb-eighth-notes", oldNbEighthNotes - nbEighthNotesToDelete);
        module.updateAudioEngineLoopDefinition();
    },

    // Returns the sound occurrences as an object
    _getSoundOccurrences: function() {
        var nbEighthNotes = $("#loop-edit #instruments").data("nb-eighth-notes");
        var res = {};
        $(window.aCompas.instruments).each(function(instrumentIndex, instrumentData) {
            var instrumentSoundOccurrences = {};
            $(window.aCompas.sounds[instrumentData.slug]).each(function(soundIndex, soundData) {
                instrumentSoundOccurrences[soundData.id] = [];
                for (var i = 0; i < nbEighthNotes; i++) {
                    var isOn = $("#loop-edit #instruments #sound-occurrence-" + soundData.id
                        + "-" + i).is(":checked");
                    instrumentSoundOccurrences[soundData.id].push(isOn);
                }
            });
            res[instrumentData.slug] = instrumentSoundOccurrences;
        });
        return res;
    },

    loadSoundOccurrences: function(soundOccurrences) {
        for (var instrument in soundOccurrences) {
            if (soundOccurrences.hasOwnProperty(instrument)) {
                for (var soundId in soundOccurrences[instrument]) {
                    if (soundOccurrences[instrument].hasOwnProperty(soundId)) {
                        for (var i = 0; i < soundOccurrences[instrument][soundId].length; i++) {
                            $("#loop-edit #instruments #sound-occurrence-"
                                + soundId + "-" + i).prop("checked", soundOccurrences[instrument][soundId][i]);
                        }
                    }
                }
            }
        }
    },

    // Get loop.definition from the UI
    getLoopDefinition: function() {
        var module = this;

        // Settings

        // Name
        var loopName = $.trim($("#loop-edit #name").val());
        if (loopName.length === 0) {
            loopName = null;
        }
        // Description
        var loopDescription = $.trim($("#loop-edit #description").val());
        if (loopDescription.length === 0) {
            loopDescription = null;
        }
        // Public loop ?
        var loopIsPublic = $("#loop-edit #is-public").is(":checked");

        // Rhythm

        // Palo
        var loopPalo = $.trim($("#loop-edit #palo").val());
        if (loopPalo.length === 0) {
            loopPalo = null;
        }
        // Rhythmic structure
        var loopRhythmicStructure = new Array();
        $("#loop-edit #rhythmic-structure .rhythmic-structure-item").each(function(index, elt) {
            var beatLabelStr = $(elt).find(".beat-label").val();
            var beatLabel = null;
            if (beatLabelStr.length !== 0) {
                beatLabel = parseInt(beatLabelStr);
            }
            var isStrong = $(elt).find(".is-strong").is(":checked");
            loopRhythmicStructure.push({
                label: beatLabel,
                isStrong: isStrong
            });
        });

        // Sounds
        var loopSoundOccurrences = module._getSoundOccurrences();

        // Pack everything up
        var loopDefinition = {
            name: loopName,
            description: loopDescription,
            isPublic: loopIsPublic,
            palo: loopPalo,
            rhythmicStructure: loopRhythmicStructure,
            soundOccurrences: loopSoundOccurrences
        };
        return loopDefinition;
    },

    updateAudioEngineLoopDefinition: function() {
        var module = this;
        var loopDefinition = module.getLoopDefinition();
        window.aCompas.audioEngine.setLoopDefinition(loopDefinition);
    }

}

window.aCompas.ui.registerModule("loop-edit-sounds", loopEditSoundsModule);

$(document).on("change", "#loop-edit #instruments .sound-occurrence-container input[type=checkbox]", function(e) {
    var module = window.aCompas.ui.getModule("loop-edit-sounds");
    module.updateAudioEngineLoopDefinition();
});
