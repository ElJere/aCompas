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
        var loopEditSoundsModule = window.aCompas.ui.getModule("loop-edit-sounds");
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
        loopEditSoundsModule.appendEighthNotes(nbBeatsToAppend * 2);
        $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats + nbBeatsToAppend);
    },

    truncateRhythmicStructure: function(nbBeatsToDelete) {
        var loopEditSoundsModule = window.aCompas.ui.getModule("loop-edit-sounds");
        var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
        for (var i = 0; i < nbBeatsToDelete; i++) {
            var beatIndexToDelete = oldNbBeats - i - 1;
            $("#loop-edit #rhythmic-structure .rhythmic-structure-item-container[data-beat-index="
                + beatIndexToDelete + "]").remove();
        }
        loopEditSoundsModule.truncateEighthNotes(nbBeatsToDelete * 2);
        $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats - nbBeatsToDelete);
    }

}

window.aCompas.ui.registerModule("loop-edit-rhythm", loopEditRhythmModule);

$(document).on("click", "#loop-edit #btn-update-rhythmic-structure", function(e) {
    e.preventDefault();
    var updateRhythmicStructureBtn = $(this);
    var loopEditRhythmModule = window.aCompas.ui.getModule("loop-edit-rhythm");
    if (! updateRhythmicStructureBtn.hasClass("disabled")) {
        var newNbBeats = parseInt($("#loop-edit #nb-beats").val());
        var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
        if (oldNbBeats === undefined) {
            oldNbBeats = 0;
        }
        if (newNbBeats < oldNbBeats) {
            var nbBeatsToDelete = oldNbBeats - newNbBeats;
            // The user is about to remove some beats from the rhythmic structure.
            // Ask for a confirmation
            window.aCompas.ui.confirmationModal("Are you sure you want to shrink the rhythmic structure ?",
                "<p><b>You are about to remove " + nbBeatsToDelete
                    + " beat(s) from the rhythmic structure !</b> If you decide to confirm, the following will be done :</p>"
                    + "<p><i>a)</i> The last " + nbBeatsToDelete
                    + " beat(s) will be deleted from the rhythmic structure.</p>"
                    + "<p><i>b)</i> Information about sound occurrences which happen at the last "
                    + nbBeatsToDelete + " beat(s) in your loop will be lost.</p>"
                    + "</ul>"
                    + "<p>If you decide to cancel, nothing will be changed.</p>",
                // onConfirmCallback
                function() {
                    loopEditRhythmModule.truncateRhythmicStructure(nbBeatsToDelete);
                    loopEditRhythmModule.setRhythmicStructureUpdateButtonState(false);
                    window.aCompas.ui.toast("The rhythmic structure was updated");
                },
                // onCancelCallback
                function() {
                    // Restore old nb-beats value
                    $("#loop-edit #nb-beats").val(oldNbBeats);
                    window.aCompas.ui.toast("Canceled !");
                });
        } else {
            loopEditRhythmModule.appendBeatsToRhythmicStructure(newNbBeats - oldNbBeats);
            loopEditRhythmModule.setRhythmicStructureUpdateButtonState(false);
            window.aCompas.ui.toast("The rhythmic structure was updated");
        }
    }
});

$(document).on("keyup wheel change", "#loop-edit #nb-beats", function(e) {
    var nbBeatsInput = $(this);
    var loopEditRhythmModule = window.aCompas.ui.getModule("loop-edit-rhythm");
    // If the event is a mouse wheel rotation and the input is not focused,
    // its value is not changed but this code is called. In that case,
    // there is nothing to do because the input's value is not modified.
    if (e.type === "wheel" && ! nbBeatsInput.is(":focus")) {
        return ;
    }
    // When the mouse wheel is used to change the input's value, this code is
    // called BEFORE the value is actualy changed in the UI. So here, the ugly
    // trick is to trigger a "change" event after waiting for a few milliseconds.
    if (e.type === "wheel") {
        window.setTimeout(function() {
            nbBeatsInput.change();
        }, 100);
        return ;
    }
    loopEditRhythmModule.updateRhythmicStructureUpdateButton();
    // Check if the value is a strictly positive integer
    if (loopEditRhythmModule.nbBeatsIsValid()) {
        nbBeatsInput.removeClass("invalid").addClass("valid");
    } else {
        nbBeatsInput.removeClass("valid").addClass("invalid");
        if (nbBeatsInput.val().length > 0) {
            window.aCompas.ui.uniqueToast("The number of beats in the loop must be a strictly positive integer !");
        }
    }
});

$(document).on("keyup wheel change", "#loop-edit #rhythmic-structure .beat-label", function(e) {
    var beatLabelInput = $(this);
    var loopEditSoundsModule = window.aCompas.ui.getModule("loop-edit-sounds");

    // If the event is a mouse wheel rotation and the input is not focused,
    // its value is not changed but this code is called. In that case,
    // there is nothing to do because the input's value is not modified.
    if (e.type === "wheel" && ! beatLabelInput.is(":focus")) {
        return ;
    }
    // When the mouse wheel is used to change the input's value, this code is
    // called BEFORE the value is actualy changed in the UI. So here, the ugly
    // trick is to trigger a "change" event after waiting for a few milliseconds.
    if (e.type === "wheel") {
        window.setTimeout(function() {
            beatLabelInput.change();
        }, 100);
        return ;
    }

    // Check if the typed number is a strictly positive integer
    var beatLabelStr = beatLabelInput.val();
    var beatLabel = parseInt(beatLabelStr);
    if (beatLabel && beatLabel > 0 && beatLabel == beatLabelStr) {
        beatLabelInput.removeClass("invalid").addClass("valid");
        loopEditSoundsModule.updateAudioEngineLoopDefinition();
    } else {
        beatLabelInput.removeClass("valid").addClass("invalid");
        if (beatLabelStr.length !== 0) {
            window.aCompas.ui.uniqueToast("A beat's label must be a strictly positive integer !");
        }
    }
});

$(document).on("change", "#loop-edit #rhythmic-structure .is-strong", function(e) {
    var loopEditSoundsModule = window.aCompas.ui.getModule("loop-edit-sounds");
    loopEditSoundsModule.updateAudioEngineLoopDefinition();
});
