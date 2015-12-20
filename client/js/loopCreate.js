FlowRouter.route('/create-loop', {
    name: "loopCreate",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function () {
        Meteor.call("addLoop", function(error, result) {
//TODO Error handling
            var loopId = result;
            FlowRouter.go("loopEdit", {_id: loopId});
        });
    }
});
