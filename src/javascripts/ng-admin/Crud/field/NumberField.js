/*global define*/

define(function (require) {
    'use strict';

    var numberFieldView = require('text!./NumberField.html');

    function NumberField() {
        return {
            restrict: 'E',
            template: numberFieldView
        };
    }

    NumberField.$inject = [];

    return NumberField;
});
