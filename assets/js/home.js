(function ($, window, document) {
    "use strict";

    var HOME = {
        init: function () {
            console.log('home');
        }
    };

    window.MYAPP.init();
    $(document).ready(HOME.init);

})(jQuery, window, document);
