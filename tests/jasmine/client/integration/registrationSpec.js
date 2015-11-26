describe("New user registration", function() {
    it("should support new user registration", function(done) {
        var userData = window.aCompas.testing.registerUser(done);
        expect(userData.email).toEqual(jasmine.anything());
        expect(userData.password).toEqual(jasmine.anything());
        done();
    });
});
