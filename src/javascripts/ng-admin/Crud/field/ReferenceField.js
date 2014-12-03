/*global define*/

define(function (require) {
    'use strict';

    var referenceFieldView = require('text!./ReferenceField.html');

    function ReferenceField() {
        return {
            restrict: 'E',
            template: referenceFieldView,
            link: function (scope) {
                scope.choices = scope.field.getChoices();
            }
        };
    }

    ReferenceField.$inject = [];

    return ReferenceField;
});
