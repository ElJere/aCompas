window.aCompas = {};

Meteor.subscribe("loops");

// Configure useraccounts:flow-routing
AccountsTemplates.configure({
    defaultLayout: 'layout',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main',
    enablePasswordChange: true,
    showForgotPasswordLink: true
});
AccountsTemplates.configureRoute("changePwd");
AccountsTemplates.configureRoute("enrollAccount");
AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("verifyEmail");
AccountsTemplates.configureRoute("resendVerificationEmail");

Accounts.onLogin(function() {
     window.aCompas.ui.fillMenu();
});

/*
    Set <body> as the root for kadira:blaze-layout rendering.
    Without this, some rules from Materialize don't apply correctly
*/
BlazeLayout.setRoot('body');

Template.layout.onRendered(function() {
    window.aCompas.ui.fillMenu();
    this.$(".button-collapse").sideNav({
        closeOnClick: true
    });
});
