describe("Loop creation", function() {
    it("should support new user registration", function(done) {
        var userData = window.aCompas.testing.registerUser(done);
        expect(userData.email).toEqual(jasmine.anything());
        expect(userData.password).toEqual(jasmine.anything());
        done();
    });
    it("should be possible to create a loop", function(done) {
        window.aCompas.testing.createLoop(done);
        done();
    });
});
