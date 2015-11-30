FlowRouter.route("/my-favorite-loops", {
    name: "loopFavorites",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function() {
        BlazeLayout.render("layout", { main: "loopFavorites" });
    }
});
