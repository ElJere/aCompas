describe("My loops page", function() {
    it("should support new user registration", function(done) {
        var userData = window.aCompas.testing.registerUser(done);
        expect(userData.email).toEqual(jasmine.anything());
        expect(userData.password).toEqual(jasmine.anything());
        done();
    });
    it("should show up a text saying that the \"my loops\" list is empty", function(done) {
        $("#btn-menu-my-loops").click();
        window.aCompas.testing.waitForElement("#txt-empty", done);
        done();
    });
    it("should be possible to create a loop", function(done) {
        window.aCompas.testing.createLoop(done);
        done();
    });
    it("should show up a newly created loop", function(done) {
        $("#btn-menu-my-loops").click();
        window.aCompas.testing.waitForElement("#my-loops-collection li", done);
        done();
    });
});
