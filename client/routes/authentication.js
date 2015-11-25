FlowRouter.route('/authentication', {
    name: "authentication",
    action: function () {
        if (Meteor.userId()) {
            FlowRouter.go("home");
            return ;
        }
        BlazeLayout.render("mainLayout", { main: "authentication" });
    }
});
