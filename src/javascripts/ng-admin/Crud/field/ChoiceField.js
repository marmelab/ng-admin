/*global define*/

define(function (require) {
    'use strict';

    var choiceFieldView = require('text!./ChoiceField.html');

    function ChoiceField() {
        return {
            restrict: 'E',
            template: choiceFieldView
        };
    }

    ChoiceField.$inject = [];

    return ChoiceField;
});
