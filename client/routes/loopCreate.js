FlowRouter.route('/create-loop', {
    name: "loopCreate",
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function () {
        var loopId = Meteor.call("addLoop", function(error, result) {
            var loopId = result;
            FlowRouter.go("loopEdit", {_id: loopId});
        });
    }
});
