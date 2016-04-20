// DO NOT REMOVE THIS!! This polyfill provides correct work in IE while we are using Babel to transform our JS.
import "babel-polyfill";
import {foo} from "./modules/foo";
import {a as myArr} from "./modules/vars";


// JUST EXAMPLE OF USAGE! Import jQuery from node_modules and set global scope.
// REMOVE ALL THIS FOR YOUR PROJECT
global.jQuery = require('jquery');
global.$ = global.jQuery;


console.info(`Environment: ${process.env.NODE_ENV}`, process.env);

const GLOBAL = {
    home_init () {
        let {a, b} = myArr;
        console.log(`${a}, ${b} `, myArr);
        const executeFunction = foo(a, b);
        console.log(executeFunction);
        console.log(this);
        this.example_wp_ajax();
    },
    load () {
    },
    resize () {
    },
    scroll () {
    },
    example_wp_ajax () {
        console.log(vars);
        $.ajax({
            type: 'GET',
            url: vars.ajaxUrl,
            data: {
                action: 'add_content'
            },
            dataType: 'html',
            success (response) {
                $('#example_wp_ajax').html(process.env.NODE_ENV);
                if (global.vars.example_wp_ajax_callback) {
                    global.vars.example_wp_ajax_callback(response);
                }
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });
    }
};


let init = null;

switch (global.vars.page) {
    case 'home_page':
        init = GLOBAL.home_init.bind(GLOBAL);
        break;
    case 'about_page':
        init = GLOBAL.about_init.bind(GLOBAL);
    default:
        init = () => console.error('Init is not a function');
}

$(document).ready(init);