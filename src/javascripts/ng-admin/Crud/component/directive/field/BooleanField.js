define(function(require) {
    'use strict';

    var angular = require('angular');
    var booleanFieldView = require('text!../../../view/field/boolean.html');

    function BooleanField() {
        return {
            restrict: 'E',
            template: booleanFieldView
        };
    }

    BooleanField.$inject = [];

    return BooleanField;
});
