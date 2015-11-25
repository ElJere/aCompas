FlowRouter.route("/my-loops", {
    name: "loopMy",
    action: function() {
        if (Meteor.user()) {
            BlazeLayout.render("mainLayout", { main: "loopMy" });
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

Template.loopMy.helpers({
    myLoops: function () {
        return Loops.find({owner: Meteor.userId()}, {sort: {createdAt: -1}});
    }
});
