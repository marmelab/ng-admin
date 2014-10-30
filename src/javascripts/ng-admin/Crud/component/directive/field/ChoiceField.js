/*global define*/

define(function (require) {
    'use strict';

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
