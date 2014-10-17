define(function(require) {
    'use strict';

    var NProgress = require('nprogress');

    var NProgressService = function () {
      return NProgress;
    }

    NProgressService.$inject = [];

    return NProgressService;
});
