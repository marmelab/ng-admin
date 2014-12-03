/*global define*/

define(function (require) {
    'use strict';

    var stringFieldView = require('text!./StringField.html');

    function StringField() {
        return {
            restrict: 'E',
            template: stringFieldView
        };
    }

    StringField.$inject = [];

    return StringField;
});
