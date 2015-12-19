//TODO Check that the loop's owner is the current user
FlowRouter.route("/edit-loop/:_id",{
    name: "loopEdit",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function() {
        window.aCompas.audioEngine.initialize();
        Session.set("currentLoopId", FlowRouter.getParam("_id"));
        BlazeLayout.render("layout", { main: "loopEdit" });
    }
});

Template.loopEdit.onRendered(function() {
    $('#loop-edit ul.tabs').tabs();

    // Load data from mongoDB in the UI
    var loopId = Session.get("currentLoopId");
    var loop = Loops.findOne({_id: loopId});
    if (loop.definition !== undefined) {
        // Name
        if (loop.definition.name !== undefined) {
            $("#loop-edit #name").val(loop.definition.name);
        }
        // Description
        if (loop.definition.description !== undefined) {
            $("#loop-edit #description").val(loop.definition.description);
            // See http://materializecss.com/forms.html#textarea
            $("#loop-edit #description").trigger("autoresize");
        }
        // Is the loop public ?
        if (loop.definition.isPublic !== undefined) {
            $("#loop-edit #is-public").prop("checked", loop.definition.isPublic);
        }
        // Palo
        if (loop.definition.palo !== undefined) {
            $("#loop-edit #palo").val(loop.definition.palo);
        }
        // Number of beats
        if (loop.definition.rhythmicStructure !== undefined) {
            var nbBeats = loop.definition.rhythmicStructure.length;
            $("#loop-edit #nb-beats").val(nbBeats);
        }
        // Rhythmic structure
        if (loop.definition.rhythmicStructure !== undefined) {
            appendBeatsToRhythmicStructure(loop.definition.rhythmicStructure.length);
            for (var i = 0; i < loop.definition.rhythmicStructure.length; i++) {
                var beatData = loop.definition.rhythmicStructure[i];
                var rhythmicStructureItem = $("#loop-edit #rhythmic-structure .rhythmic-structure-item-container[data-beat-index=" + i + "]");
                if (beatData.label !== undefined) {
                    $(rhythmicStructureItem).find(".beat-label").val(beatData.label);
                }
                if (beatData.isStrong !== undefined) {
                    $(rhythmicStructureItem).find(".is-strong").prop("checked", beatData.isStrong);
                }
            }
        }
    }

    // Disable "Update rhythmic structure" button
    setRhythmicStructureUpdateButtonState(false);

    // Ugly : trigger elements validation
    // See https://github.com/Dogfalo/materialize/blob/master/js/forms.js
    // ... where window.validate_field(elt) is defined.
    $("#loop-edit #name, #loop-edit #description, #loop-edit #palo, #loop-edit #nb-beats, #loop-edit #rhythmic-structure .beat-label")
        .each(function(index, elt) {
            window.validate_field($(elt));
        });
});

function updateRhythmicStructureUpdateButton() {
    var isEnabled = null;
    if (nbBeatsIsValid()) {
        if (parseInt($("#loop-edit #nb-beats").val())
            === parseInt($("#loop-edit #rhythmic-structure").data("nb-beats"))) {
            isEnabled = false;
        } else {
            isEnabled = true;
        }
    } else {
        isEnabled = false;
    }
    setRhythmicStructureUpdateButtonState(isEnabled);
}

function setRhythmicStructureUpdateButtonState(isEnabled) {
    if (isEnabled) {
        $("#loop-edit #btn-update-rhythmic-structure").removeClass("disabled")
            .addClass("waves-effect waves-red");
    } else {
        $("#loop-edit #btn-update-rhythmic-structure").addClass("disabled")
            .removeClass("waves-effect waves-red");
    }
}

$(document).on("click", "#loop-edit #btn-update-rhythmic-structure", function(e) {
    e.preventDefault();
    var updateRhythmicStructureBtn = $(this);
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
                    truncateRhythmicStructure(nbBeatsToDelete);
                    setRhythmicStructureUpdateButtonState(false);
                    window.aCompas.ui.toast("The rhythmic structure was updated");
                },
                // onCancelCallback
                function() {
                    // Restore old nb-beats value
                    $("#loop-edit #nb-beats").val(oldNbBeats);
                    window.aCompas.ui.toast("Canceled !");
                });
        } else {
            appendBeatsToRhythmicStructure(newNbBeats - oldNbBeats);
            setRhythmicStructureUpdateButtonState(false);
            window.aCompas.ui.toast("The rhythmic structure was updated");
        }
    }
});

function nbBeatsIsValid() {
    var nbBeatsStr = $("#loop-edit #nb-beats").val();
    var nbBeats = parseInt(nbBeatsStr);
    // Check if the value is a strictly positive integer
    if (nbBeats && nbBeats > 0 && nbBeats == nbBeatsStr) {
        return true;
    } else {
        return false;
    }
}


$(document).on("keyup wheel change", "#loop-edit #nb-beats", function(e) {
    var nbBeatsInput = $(this);
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
    updateRhythmicStructureUpdateButton();
    // Check if the value is a strictly positive integer
    if (nbBeatsIsValid()) {
        nbBeatsInput.removeClass("invalid").addClass("valid");
    } else {
        nbBeatsInput.removeClass("valid").addClass("invalid");
        if (nbBeatsInput.val().length > 0) {
            window.aCompas.ui.uniqueToast("The number of beats in the loop must be a strictly positive integer !");
        }
    }
});

function getRhythmicStructureItem(beatIndex) {
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
}

function appendBeatsToRhythmicStructure(nbBeatsToAppend) {
    var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
    if (oldNbBeats === undefined) {
        oldNbBeats = 0;
        // Delete the message which is initialy shown
        $("#loop-edit #rhythmic-structure").html("");
    }
    var html = "";
    for (var i = 0; i < nbBeatsToAppend; i++) {
        html += getRhythmicStructureItem(oldNbBeats + i);
    }
    $("#loop-edit #rhythmic-structure").append(html);
    $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats + nbBeatsToAppend);
}

function truncateRhythmicStructure(nbBeatsToDelete) {
    var oldNbBeats = $("#loop-edit #rhythmic-structure").data("nb-beats");
    for (var i = 0; i < nbBeatsToDelete; i++) {
        var beatIndexToDelete = oldNbBeats - i - 1;
        $("#loop-edit #rhythmic-structure .rhythmic-structure-item-container[data-beat-index="
            + beatIndexToDelete + "]").remove();
    }
    $("#loop-edit #rhythmic-structure").data("nb-beats", oldNbBeats - nbBeatsToDelete);
}

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

$(document).on("click", "#loop-edit #btn-save", function(e) {
    e.preventDefault();
    var currentLoopId = Session.get("currentLoopId");

    // Extract values from the UI

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

    // Pack everything up
    var loopDefinition = {
        name: loopName,
        description: loopDescription,
        isPublic: loopIsPublic,
        palo: loopPalo,
        rhythmicStructure: loopRhythmicStructure
    };
    // Call server method
    Meteor.call("saveLoop", currentLoopId, loopDefinition, function(error, result) {
//TODO Error handling
        window.aCompas.ui.toast("The loop was saved");
    });
});
