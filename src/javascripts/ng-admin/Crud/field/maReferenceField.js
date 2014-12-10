/*global define*/

define(function (require) {
    'use strict';

    var referenceFieldView = require('text!./ReferenceField.html');

    function maReferenceField() {
        return {
            restrict: 'E',
            template: referenceFieldView,
            link: function (scope) {
                scope.choices = scope.field.getChoices();
            }
        };
    }

    maReferenceField.$inject = [];

    return maReferenceField;
});
