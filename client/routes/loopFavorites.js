FlowRouter.route("/my-favorite-loops", {
    name: "loopFavorites",
    action: function() {
        if (Meteor.user()) {
            BlazeLayout.render("mainLayout", { main: "loopFavorites" });
            return ;
        } else {
            //TODO access denied page
            FlowRouter.go("home");
            return ;
        }
        // We shouldn't go further
        throw new Meteor.Error("internal-error");
    }
});
