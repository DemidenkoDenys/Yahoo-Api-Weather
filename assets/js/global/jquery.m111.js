(function ( $ ) {

    var m_class = 'm111';

    $.fn.m111 = function ( options ) {

        var settings = $.extend( {
            name: m_class,
            source: null,
            fade: 400,
            onOpen: function ( ui ) {
            },
            onClose: function ( ui ) {
            },
            onItemClick: function ( ui ) {
            }
        }, options );

        var name = settings.name,
            $menu = $( '#' + name );

        if ( $menu.length === 0 ) {
            $menu = $( '<div />' )
                .attr( 'id', name )
                .appendTo( $( 'body' ) );
        }

        $menu.addClass( m_class ).addClass( 'fixed' ).data( {
            opened: false,
            onOpen: settings.onOpen,
            onClose: settings.onClose
        } );

        if ( typeof settings.source === 'string' ) {
            var $clone = null,
                selectors = settings.source.split( ',' );

            $.each( selectors, function ( index, element ) {
                $clone = $( element ).clone();
                $clone
                    .removeAttr( 'id' )
                    .removeAttr( 'class' )
                    .addClass( 'menu-navigation' );
                $clone.find( '>ul' )
                    .removeAttr( 'id' )
                    .removeAttr( 'class' )
                    .addClass( 'menu' );
                $clone.find( 'ul' )
                    .append( '<div class="clr"/>' );
                $clone.find( '>ul' ).find( 'ul' )
                    .removeAttr( 'id' )
                    .removeAttr( 'class' )
                    .addClass( 'sub-menu' );
                $clone.find( 'li' )
                    .removeAttr( 'id' )
                    .removeAttr( 'class' )
                    .addClass( 'menu-item' );
                $clone.find( 'a' )
                    .removeAttr( 'id' )
                    .removeAttr( 'class' )
                    .addClass( 'menu-link' );

                $clone.find( 'li' ).each( function () {
                    var ul = $( this ).find( 'ul' ).get( 0 );
                    if ( ul != null ) {
                        $( this ).addClass( 'has-sub-menu' );
                        var div = $( '<div />' ).addClass( 'sub-navigation' ).appendTo( this );
                        $( ul ).clone().appendTo( div );
                        $( ul ).remove();
                    }
                } );

                var outerHTML = $( "<div />" ).append( $clone.clone() ).html();
                outerHTML = outerHTML
                    .replace( /<ul/g, '<div' )
                    .replace( /<\/ul>/g, '</div>' )
                    .replace( /<li/g, '<div' )
                    .replace( /<\/li>/g, '</div>' );
                $menu.html( outerHTML );

                $menu.find( '.has-sub-menu' ).each( function () {
                    var $li = $( this );
                    $li.find( 'a' ).click( function () {
                        var nav = $( $li ).find( '.sub-navigation' ).get( 0 ),
                            $back = $( '<a href="javascript:void(0)"><i class="fo">&#xe810;</i></a>' )
                                .addClass( m_class + '-btn' )
                                .appendTo( $( nav ) );
                        $back.click( function () {
                            $( nav ).animate( {opacity: 0, right: '-100%'}, settings.fade );
                        } );
                        $( nav ).animate( {opacity: 1, right: 0}, settings.fade );
                    } );
                } );

                $menu.find( ".menu-item" ).not( ".has-sub-menu" ).find( "a" ).each( function () {
                    var $item = $( this );
                    $item.click( function ( e ) {
                        settings.onItemClick( {menu: $menu, item: $( this ), close: toggleMenu} );
                    } );
                } );

            } );
        }
        else if ( settings.source !== null ) {
            $.error( 'Invalid menu source' );
        }

        var resize = function () {
            $( '.' + m_class + ' .menu-navigation, .' + m_class + ' .sub-navigation' ).each( function () {
                var ul = $( this ).find( '.menu, .sub-menu' ).get( 0 ),
                    height = 0;
                $( ul ).children( '.menu-item' ).each( function () {
                    var margin_top = $( this ).css( "margin-top" ).replace( "px", "" );
                    var margin_bottom = $( this ).css( "margin-bottom" ).replace( "px", "" );

                    height += $( this ).height() + parseInt( margin_top ) + parseInt( margin_bottom );
                } );
                $( ul ).css( {marginTop: ($( window ).height() - height) / 2} );
            } );
        };

        var toggleMenu = function ( e ) {
            if ( e ) {
                e.preventDefault();
            }

            $( 'html, body' ).toggleClass( m_class + '-overflow' );
            $menu.data( {
                opened: !$menu.data( 'opened' )
            } );
            $menu.toggleClass( 'opened' );
            resize();
            $menu.fadeToggle( settings.fade, function () {

                var $subs = $menu.find( '.sub-navigation' );

                $subs.each( function () {
                    $( this ).css( {opacity: 0, right: '-100%'} );
                } );

                if ( $menu.data( 'opened' ) ) {
                    settings.onOpen( {menu: $menu} );
                } else {
                    settings.onClose( {menu: $menu} );
                }
            } );
        };

        $close = $( '<a href="javascript:void(0)"><i class="fo">&#xe811;</i></a>' )
            .addClass( m_class + '-close-btn' )
            .appendTo( $menu.find( '.menu-navigation' ).get( 0 ) );
        $close.click( toggleMenu );

        $( window ).resize( resize );

        return this.each( function () {
            var $this = $( this );

            $this.click( toggleMenu );
        } );
    };

})( jQuery );
