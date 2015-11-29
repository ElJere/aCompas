//TODO Check that the loop's owner is the current user
FlowRouter.route("/edit-loop/:_id",{
    name: "loopEdit",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function() {
        window.aCompas.audioEngine.initialize();
        var loop = Loops.findOne({_id: FlowRouter.getParam("_id")});
        BlazeLayout.render("mainLayout", { main: "loopEdit" });
    }
});

Template.loopEdit.onRendered(function() {
    $('ul.tabs').tabs();
});
