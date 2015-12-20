// Create a window.aCompas.ui module
var loopEditRhythmModule = {

    updateRhythmicStructureUpdateButton: function() {
        var module = this;
        var isEnabled = null;
        if (module.nbBeatsIsValid()) {
            if (parseInt($("#loop-edit #nb-beats").val())
                === parseInt($("#loop-edit #rhythmic-structure").data("nb-beats"))) {
                isEnabled = false;
            } else {
                isEnabled = true;
            }
        } else {
            isEnabled = false;
        }
        module.setRhythmicStructureUpdateButtonState(isEnabled);
    },

    setRhythmicStructureUpdateButtonState: function(isEnabled) {
        if (isEnabled) {
            $("#loop-edit #btn-update-rhythmic-structure").removeClass("disabled")
                .addClass("waves-effect waves-red");
        } else {
            $("#loop-edit #btn-update-rhythmic-structure").addClass("disabled")
                .removeClass("waves-effect waves-red");
        }
    },

    nbBeatsIsValid: function() {
        var nbBeatsStr = $("#loop-edit #nb-beats").val();
        var nbBeats = parseInt(nbBeatsStr);
        // Check if the value is a strictly positive integer
        if (nbBeats && nbBeats > 0 && nbBeats == nbBeatsStr) {
            return true;
        } else {
            return false;
        }
    },

    getRhythmicStructureItem: function(beatIndex) {
        var html = "";
        html += "<div class=\"col s12 m6 l6 rhythmic-structure-item-container\" data-beat-index=\""
            + beatIndex + "\">";
        html += "<div class=\"rhythmic-structure-item\">"
        html += "<div class=\"row\">"
        html += "<div class=\"input-field col s12\">";
        html += "<input type=\"number\" class=\"validate beat-label\" placeholder=\"Not set\" min=\"1\" />";
        html += "<label for=\"beat-label-" + beatIndex
            + "\" class=\"active label-highlighted\">Label for beat n°" + (beatIndex + 1) + "</label>";
        html += "</div>";
        html += "</div>";
        html += "<div class=\"row\">";
        html += "<div class=\"switch col s12\">";
        html += "<label>";
        html += "Weak beat";
        html += "<input type=\"checkbox\" class=\"is-strong\" />";
        html += "<span class=\"lever\"></span>";
        html += "Strong beat";
        html += "</label>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
        return html;
    },

    appendBeatsToRhythmicStructure: function(nbBeatsToAppend) {
        var module = this;
        var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
        if (oldNbBeats === undefined) {
            oldNbBeats = 0;
            // Delete the message which is initialy shown
            $("#loop-edit #rhythmic-structure").html("");
        }
        var html = "";
        for (var i = 0; i < nbBeatsToAppend; i++) {
            html += module.getRhythmicStructureItem(oldNbBeats + i);
        }
        $("#loop-edit #rhythmic-structure").append(html);
        $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats + nbBeatsToAppend);
    },

    truncateRhythmicStructure: function(nbBeatsToDelete) {
        var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
        for (var i = 0; i < nbBeatsToDelete; i++) {
            var beatIndexToDelete = oldNbBeats - i - 1;
            $("#loop-edit #rhythmic-structure .rhythmic-structure-item-container[data-beat-index="
                + beatIndexToDelete + "]").remove();
        }
        $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats - nbBeatsToDelete);
    }

}

window.aCompas.ui.registerModule("loop-edit-rhythm", loopEditRhythmModule);
