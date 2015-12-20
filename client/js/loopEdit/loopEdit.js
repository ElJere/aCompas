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
    var loopEditRhythmModule = window.aCompas.ui.getModule("loop-edit-rhythm");
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
            loopEditRhythmModule.appendBeatsToRhythmicStructure(loop.definition.rhythmicStructure.length);
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
    loopEditRhythmModule.setRhythmicStructureUpdateButtonState(false);

    // Ugly : trigger elements validation
    // See https://github.com/Dogfalo/materialize/blob/master/js/forms.js
    // ... where window.validate_field(elt) is defined.
    $("#loop-edit #name, #loop-edit #description, #loop-edit #palo, #loop-edit #nb-beats, #loop-edit #rhythmic-structure .beat-label")
        .each(function(index, elt) {
            window.validate_field($(elt));
        });
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
