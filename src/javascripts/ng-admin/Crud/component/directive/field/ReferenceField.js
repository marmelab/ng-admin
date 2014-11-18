/*global define*/

define(function (require) {
    'use strict';

    var referenceFieldView = require('text!../../../view/field/reference.html');

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
