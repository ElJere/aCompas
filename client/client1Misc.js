window.aCompas = {};

Meteor.subscribe("loops");

AutoForm.setDefaultTemplate('materialize');

Accounts.onLogin(function() {
    window.aCompas.ui.fillMenu();
    FlowRouter.go("home");
});

Template.mainLayout.onRendered(function() {
    window.aCompas.ui.fillMenu();
    this.$(".button-collapse").sideNav({
        closeOnClick: true
    });
});
