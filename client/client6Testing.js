// Those functions are used only for testing with Jasmine

window.aCompas.testing = {
    loadPath: function(path) {
        FlowRouter.go(path);
        FlowRouter.watchPathChange();
    },
    loadRoute: function(routeName) {
        this.loadPath(FlowRouter.path(routeName));
    },
    // From https://meteor-testing.readme.io/docs/jasmine-template-testing
    waitForElement: function(selector, successCallback) {
        var checkInterval = 50;
        var timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        var startTime = Date.now();
        var intervalId = Meteor.setInterval(function () {
            if (Date.now() > startTime + timeoutInterval) {
                Meteor.clearInterval(intervalId);
                // Jasmine will handle the test timeout error
            } else if ($(selector).length > 0) {
                Meteor.clearInterval(intervalId);
                successCallback();
            }
        }, checkInterval);
    },
    // From http://stackoverflow.com/questions/9407892/how-to-generate-random-sha1-hash-to-use-as-id-in-node-js
    generateRandomHash: function() {
        var len = 32;
        var arr = new Uint8Array(len / 2);
        window.crypto.getRandomValues(arr);
        return [].map.call(arr, function(n) { return n.toString(16); }).join("");
    }
};
