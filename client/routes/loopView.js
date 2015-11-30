FlowRouter.route("/loop/:_id", {
    name: "loopView",
    action: function() {
        window.aCompas.audioEngine.initialize();
        var loop = Loops.findOne({_id: FlowRouter.getParam("_id")});
        BlazeLayout.render("layout", { main: "loopView" });
    }
});
