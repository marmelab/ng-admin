define(function(require) {
    'use strict';

    var angular = require('angular');
    var numberColumnView = require('text!../../../view/column/number.html');

    function NumberColumn() {
        return {
            restrict: 'E',
            template: numberColumnView
        };
    }

    NumberColumn.$inject = [];

    return NumberColumn;
});
