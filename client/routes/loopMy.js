FlowRouter.route("/my-loops", {
    name: "loopMy",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function() {
        BlazeLayout.render("mainLayout", { main: "loopMy" });
    }
});

Template.loopMy.helpers({
    myLoops: function () {
        return Loops.find({owner: Meteor.userId()}, {sort: {createdAt: -1}});
    },
    noLoops: function () {
        var count = Loops.find({owner: Meteor.userId()}, {sort: {createdAt: -1}}).count();
        return (count === 0);
    }
});
