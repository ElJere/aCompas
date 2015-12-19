FlowRouter.route('/faq', {
    name: "faq",
    action: function () {
        BlazeLayout.render("layout", { main: "faq" });
    }
});
