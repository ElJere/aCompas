describe("Existing user authentication", function() {
    var userData = null;
    it("should support new user registration", function(done) {
        userData = window.aCompas.testing.registerUser(done);
        expect(userData.email).toEqual(jasmine.anything());
        expect(userData.password).toEqual(jasmine.anything());
        done();
    });
    it("should be possible to log in when not logged in", function(done) {
        window.aCompas.testing.authenticateUser(userData.email, userData.password, done);
        done();
    });
});
