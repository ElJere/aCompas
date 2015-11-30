FlowRouter.route('/about', {
    name: "about",
    action: function () {
        BlazeLayout.render("layout", { main: "about" });
    }
});
