define(function(require) {
    'use strict';

    var angular = require('angular');
    var choicesFieldView = require('text!../../../view/field/choices.html');

    function ChoicesField() {
        return {
            restrict: 'E',
            template: choicesFieldView
        };
    }

    ChoicesField.$inject = [];

    return ChoicesField;
});
