define(function(require) {
    'use strict';

    var angular = require('angular');
    var choiceFieldView = require('text!../../../view/field/choice.html');

    function ChoiceField() {
        return {
            restrict: 'E',
            template: choiceFieldView
        };
    }

    ChoiceField.$inject = [];

    return ChoiceField;
});
