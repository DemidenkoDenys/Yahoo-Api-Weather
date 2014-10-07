var SITE = $.extend( {
    home: {
        init: function () {
            console.log( SITE.global.temp );
        },
        resize: function () {
        },
        scroll: function () {
        }
    }
}, SITE );

$( document ).ready( SITE.home.init );
//$( window ).resize( SITE.home.resize );
//$( window ).scroll( SITE.home.scroll );
