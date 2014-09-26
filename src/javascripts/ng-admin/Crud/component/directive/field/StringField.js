define(function(require) {
    'use strict';

    var angular = require('angular');
    var stringFieldView = require('text!../../../view/field/string.html');

    function StringField() {
        return {
            restrict: 'E',
            template: stringFieldView
        };
    }

    StringField.$inject = [];

    return StringField;
});
