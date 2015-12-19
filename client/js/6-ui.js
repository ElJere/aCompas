window.aCompas.ui = {

    // Menu

    fillMenu: function() {
        var html = "";
        html += "<li><a href=\"" + FlowRouter.path("home") + "\">Home</a></li>";
        if (Meteor.userId()) {
            html += "<li><a id=\"btn-menu-my-loops\" href=\"" + FlowRouter.path("loopMy") + "\">My loops</a></li>";
            html += "<li><a href=\"" + FlowRouter.path("loopFavorites") + "\">My favorite loops</a></li>";
            html += "<li><a id=\"btn-menu-create-loop\" href=\"" + FlowRouter.path("loopCreate") + "\">Create a loop</a></li>";
            html += "<li><a href=\"" + FlowRouter.path("logout") + "\">Log out</a></li>";
        } else {
            html += "<li><a id=\"btn-menu-sign-in\" href=\"" + FlowRouter.path("atSignIn") + "\">Sign in</a></li>";
            html += "<li><a id=\"btn-menu-register\" href=\"" + FlowRouter.path("atSignUp") + "\">Register</a></li>";
        }
        $("#main-menu-big").html(html);
        $("#main-menu-small").html(html);
    },

    // Toast

    toastDisplayDuration: 8000, // Milliseconds
    toast: function(html) {
        var ui = this;
        Materialize.toast("<i class=\"mdi mdi-information\"></i>&nbsp;" + html, ui.toastDisplayDuration);
    },
    // This property stores the date when a toast was last displayed
    toastDisplayDates: [],
    // This function is a wrapper for Materialize.toast() which makes sure that
    // a toast is not displayed several times on the same screen.
    // For example, the following code will display only ONE toast. Not two.
    // window.aCompas.ui.uniqueToast("Hello world !");
    // window.aCompas.ui.uniqueToast("Hello world !");
    uniqueToast: function(html) {
        var ui = this;
        var now = Date.now();
        var foundInHistory = false;
        $(ui.toastDisplayDates).each(function(index, data) {
            if (data.html === html) {
                foundInHistory = true;
                if (data.displayDate + ui.toastDisplayDuration < now) {
                    // Toast was already displayed but is no longer on screen.
                    // Display it.
                    ui.toastDisplayDates[index].displayDate = now;
                    ui.toast(html);
                }
            }
        });
        if (foundInHistory) {
            return ;
        }
        // If this code is reached, it means it's the first time that this
        // function is called with this html
        ui.toastDisplayDates.push({
            html: html,
            displayDate: now
        });
        ui.toast(html);
    },

    // Confirmation modal

    // This function displays a confirmation modal. Depending on whether the
    // user confirms or cancels, one of the two callbacks passed as parameters
    // is called.
    confirmationModal: function(title, content, onConfirmCallback, onCancelCallback) {
        $("#confirmation-modal .title").html(title);
        $("#confirmation-modal .content").html(content);
        $("#confirmation-modal").data("confirmed", false);
        $("#confirmation-modal").openModal({
            complete: function() {
                var isConfirmed = $("#confirmation-modal").data("confirmed");
                if (isConfirmed) {
                    onConfirmCallback();
                } else {
                    onCancelCallback();
                }
            }
        });
    }
};

$(document).on("click", "#confirmation-modal .btn-cancel", function() {
    $("#confirmation-modal").data("confirmed", false);
});
$(document).on("click", "#confirmation-modal .btn-confirm", function() {
    $("#confirmation-modal").data("confirmed", true);
});
