window.MYAPP = {};
(function ($, window, document) {
    "use strict";

    var GLOBAL = {
        init: function () {
            console.log('global');
            GLOBAL.example_wp_ajax();
        },
        load: function () {

        },
        resize: function () {

        },
        scroll: function () {

        },
        example_wp_ajax: function () {
            console.log(vars);
            $.ajax({
                type: 'POST',
                url: vars.ajaxUrl,
                data: {
                    action: 'add_content'
                },
                dataType: 'html',
                success: function (response) {
                    $('#example_wp_ajax').html(response);
                },
                error: function (response) {
                    console.error(response.responseText);
                }
            });
        }
    };

    // Set global function
    window.MYAPP.init = GLOBAL.init;

    $(document).ready(GLOBAL.init);
    $(window).on({
        'load': GLOBAL.load,
        'resize': GLOBAL.resize,
        'scroll': GLOBAL.scroll
    });
})(jQuery, window, document);