window.MYAPP = {};
(function ($, window, document) {
    "use strict";

    var GLOBAL = {
        init: function () {
            console.log('global');
        },
        load: function () {

        },
        resize: function () {

        },
        scroll: function () {

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