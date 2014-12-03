/*global define*/

define(function (require) {
    'use strict';

    var choicesFieldView = require('text!./ChoicesField.html');

    function ChoicesField() {
        return {
            restrict: 'E',
            template: choicesFieldView
        };
    }

    ChoicesField.$inject = [];

    return ChoicesField;
});
