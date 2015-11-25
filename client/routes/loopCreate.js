FlowRouter.route('/create-loop', {
    name: "loopCreate",
    action: function () {
        if (! Meteor.user()) {
            //TODO access denied page
            FlowRouter.go("home");
            return ;
        } else {
            var loopId = Meteor.call("addLoop", function(error, result) {
                var loopId = result;
                FlowRouter.go("loopEdit", {_id: loopId});
            });
        }
    }
});
