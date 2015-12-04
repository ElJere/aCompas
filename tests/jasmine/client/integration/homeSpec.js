describe("Homepage", function() {
    it("Basic elements presence", function() {
        window.aCompas.testing.loadRoute("home");
        var title = $("main h2").html();
        expect(title).toBe("Home");
    });
});
