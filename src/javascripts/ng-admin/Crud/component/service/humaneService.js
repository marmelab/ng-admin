define(function(require) {
    'use strict';

    var humane = require('humane');

    var humaneService = function () {
        return humane;
    }

    humaneService.$inject = [];

    return humaneService;
});
