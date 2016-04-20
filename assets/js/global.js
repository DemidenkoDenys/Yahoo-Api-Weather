
import "babel-polyfill"; // DO NOT REMOVE THIS!! This polyfill provides correct work in IE while we are using Babel to transform our JS.


// JUST EXAMPLE OF USAGE! Import jQuery from node_modules and set global scope.
// REMOVE ALL THIS FOR YOUR PROJECT
global.jQuery = require('jquery');
global.$ = global.jQuery;

import { foo } from './modules/foo.js'
import { a as myArr } from './modules/vars.js'

(function ($, window, document) {
    "use strict";

    var GLOBAL = {
        init: function () {
            let [ a, b ] = myArr;
            console.log( `${a}, ${b} `, myArr);
            var executeFunction = foo( a, b );
            console.log(executeFunction);
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

    $(document).ready(GLOBAL.init);
    $(window).on({
        'load': GLOBAL.load,
        'resize': GLOBAL.resize,
        'scroll': GLOBAL.scroll
    });

})(jQuery, window, document);

