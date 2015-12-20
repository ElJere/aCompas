window.aCompas.help = [
    {
        slug: "nb-beats",
        title: "How can I fill the \"Number of beats in the loop\" input ?",
        content: "<p>TODO</p>"
    },
    {
        slug: "palo",
        title: "How can I fill the \"Palo\" input ?",
        content: "<p>The <i>palo</i> is the main musical form used in your loop. "
            + "Here are a few common examples : \"Bulerías\", \"Rumba\" or \"Tangos\". For more "
            + "information, read our <a href=\"/faq#what-is-a-palo\">FAQ entry about palos</a>.</p>"
    },
    {
        slug: "rhythmic-structure",
        title: "About the rhythmic structure",
        content: "<p>TODO</p>"
    }
];

$(document).on("click", ".btn-help", function(e) {
    e.preventDefault();
    var slug = $(this).data("slug");
    $(window.aCompas.help).each(function(index, helpData) {
        if (slug === helpData.slug) {
            $("#help-modal .title").html(helpData.title);
            $("#help-modal .content").html(helpData.content);
            $("#help-modal").openModal();
        }
    });
});

// Close the help modal when a link within its content is clicked
$(document).on("click", "#help-modal .modal-content a", function(e) {
    $("#help-modal").closeModal();
})
