// Those functions are used only for testing with Jasmine

window.aCompas.testing = {
    loadPath: function(path) {
        FlowRouter.go(path);
        FlowRouter.watchPathChange();
    },
    loadRoute: function(routeName) {
        var testingEngine = this;
        testingEngine.loadPath(FlowRouter.path(routeName));
        testingEngine.expectCurrentRouteToBe(routeName);
    },
    expectCurrentRouteToBe: function(routeName) {
        expect(FlowRouter.getRouteName()).toEqual(routeName);
    },
    waitForElement: function(selector, done, successCallback) {
        var testingEngine = this;
        testingEngine.waitFor(function() {
            if ($(selector).length > 0)
                return true;
            else
                return false;
        }, done, successCallback);
    },
    // Heavily inspired by https://meteor-testing.readme.io/docs/jasmine-template-testing
    waitFor: function(conditionFunction, done, successCallback) {
        var checkInterval = 50;
        var timeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        var startTime = Date.now();
        var intervalId = Meteor.setInterval(function () {
            if (Date.now() > startTime + timeoutInterval) {
                Meteor.clearInterval(intervalId);
                // Jasmine will handle the test timeout error
            } else if (conditionFunction()) {
                Meteor.clearInterval(intervalId);
                if (successCallback !== undefined) {
                    try {
                        successCallback();
                    } catch (e) {
                        console.error(e);
                        done.fail(e);
                    }
                }
            }
        }, checkInterval);
    },
    // From http://stackoverflow.com/questions/9407892/how-to-generate-random-sha1-hash-to-use-as-id-in-node-js
    generateRandomHash: function() {
        var len = 32;
        var arr = new Uint8Array(len / 2);
        window.crypto.getRandomValues(arr);
        return [].map.call(arr, function(n) { return n.toString(16); }).join("");
    },
    registerUser: function(done, email, password) {
        var testingEngine = this;
        if (email === undefined) {
            email = "test-" + testingEngine.generateRandomHash()
                + "@acompas.audio";
        }
        if (password === undefined) {
            password = testingEngine.generateRandomHash();
        }

        // Log out (in case we were previously logged in)
        testingEngine.loadRoute("logout");
        // Navigate to the authentication page
        testingEngine.loadRoute("authentication");
        testingEngine.waitForElement("#at-signUp", done, function() {
            // Click the "Register" link
            $("#at-signUp").click();
            testingEngine.waitForElement("#at-field-password_again", done, function() {
                $("#at-field-email").val(email);
                $("#at-field-password").val(password);
                $("#at-field-password_again").val(password);
                $("#at-btn").click();
                testingEngine.waitFor(function() {
                    if (Meteor.userId()) {
                        return true;
                    } else {
                        return false;
                    }
                }, done);
            });
        });
        // Return the email and passord for later use
        var res = {
            email: email,
            password: password
        }
        return res;
    },
    authenticateUser: function(email, password, done) {
        var testingEngine = this;
        // Log out (in case we were previously logged in)
        testingEngine.loadRoute("logout");
        // Navigate to the authentication page
        testingEngine.loadRoute("authentication");
        $("#at-field-email").val(email);
        $("#at-field-password").val(password);
        $("#at-btn").click();
        testingEngine.waitFor(function() {
            if (Meteor.userId()) {
                return true;
            } else {
                return false;
            }
        }, done);
    },
    deAuthenticateUser: function(done) {
        var testingEngine = this;
        testingEngine.loadRoute("logout");
        testingEngine.waitFor(function() {
            if (! Meteor.userId()) {
                return true;
            } else {
                return false;
            }
        }, done);
    },
    createLoop: function(done) {
        var testingEngine = this;
        $("#btn-menu-create-loop").click();
        testingEngine.waitFor(function() {
            if (FlowRouter.getRouteName() === "loopEdit")
                return true;
            else
                return false;
        }, done);
    }
};
