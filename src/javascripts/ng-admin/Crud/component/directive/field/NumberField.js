define(function(require) {
    'use strict';

    var angular = require('angular');
    var numberFieldView = require('text!../../../view/field/number.html');

    function NumberField() {
        return {
            restrict: 'E',
            template: numberFieldView
        };
    }

    NumberField.$inject = [];

    return NumberField;
});
