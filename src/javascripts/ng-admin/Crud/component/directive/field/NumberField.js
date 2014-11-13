/*global define*/

define(function (require) {
    'use strict';

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
