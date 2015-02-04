(function ($, window, document) {
  'use strict';

  var page = {
    init: function () {
    },
    load: function () {
    },
    resize: function () {
    },
    scroll: function () {
    }
  };

  $(document).ready(page.init);
  $(window).on({
    'load': page.load,
    'resize': page.resize,
    'scroll': page.scroll
  });
})(jQuery, window, document);
