describe("Registration", function() {
    it("should support new user registration", function(done) {
        // Log out (in case we were previously logged in)
        window.aCompas.testing.loadRoute("logout");
        // Navigate to the authentication page
        window.aCompas.testing.loadRoute("authentication");
        // Click the "Register" link
        $("#at-signUp").click();
console.log("1");
        window.aCompas.testing.waitForElement("#at-field-password_again", function() {
console.log("2");
            var email = "test-" + window.aCompas.testing.generateRandomHash()
                + "@acompas.audio";
            var password = "abcdefghijkl";
            $("#at-field-email").val(email);
            $("#at-field-password").val(password);
            $("#at-field-password_again").val(password);
            $("#at-btn").click();
            window.aCompas.testing.waitForElement("#home-title", function() {
console.log("3");
                if (! Meteor.userId()) {
                    fail("Failed to register new user !");
                }
                done();
            });
        });
    });
});
