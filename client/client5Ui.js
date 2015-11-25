window.aCompas.ui = {
    fillMenu: function() {
        var html = "";
        html += "<li><a href=\"" + FlowRouter.path("home") + "\">Home</a></li>";
        if (Meteor.userId()) {
            html += "<li><a href=\"" + FlowRouter.path("loopMy") + "\">My loops</a></li>";
            html += "<li><a href=\"" + FlowRouter.path("loopFavorites") + "\">My favorite loops</a></li>";
            html += "<li><a href=\"" + FlowRouter.path("loopCreate") + "\">Create a loop</a></li>";
            html += "<li><a href=\"" + FlowRouter.path("logout") + "\">Log out</a></li>";
        } else {
            html += "<li><a href=\"" + FlowRouter.path("authentication") + "\">Sign in / Register</a></li>";
        }
        $("#main-menu-big").html(html);
        $("#main-menu-small").html(html);
    }
};
