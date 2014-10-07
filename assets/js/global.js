var SITE = $.extend( {
    global: {
        temp: "SITE.global.temp",
        init: function () {
        },
        resize: function () {
        },
        scroll: function () {
        }
    }
}, SITE );

$( document ).ready( SITE.global.init );
//$( window ).resize( SITE.global.resize );
//$( window ).scroll( SITE.global.scroll );
