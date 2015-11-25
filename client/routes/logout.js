FlowRouter.route('/logout', {
    name: "logout",
    action: function () {
        Meteor.logout(function() {
            AccountsTemplates.logout();
            window.aCompas.ui.fillMenu();
            FlowRouter.go("home");
        });
    }
});
