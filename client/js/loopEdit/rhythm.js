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

$(document).on("keyup", "#loop-edit #rhythmic-structure .beat-label", function(e) {
    // Check if the typed number is a strictly positive integer
    var beatLabelInput = $(this);
    var beatLabelStr = beatLabelInput.val();
    var beatLabel = parseInt(beatLabelStr);
    if (beatLabel && beatLabel > 0 && beatLabel == beatLabelStr) {
        beatLabelInput.removeClass("invalid").addClass("valid");
    } else {
        if (beatLabelStr.length === 0) {
            beatLabelInput.removeClass("valid invalid");
        } else {
            beatLabelInput.removeClass("valid").addClass("invalid");
            window.aCompas.ui.uniqueToast("A beat's label must be a strictly positive integer !");
        }
    }
});
