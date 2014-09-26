define(function(require) {
    'use strict';

    var angular = require('angular');
    var referenceFieldView = require('text!../../../view/field/reference.html');

    function ReferenceField() {
        return {
            restrict: 'E',
            template: referenceFieldView
        };
    }

    ReferenceField.$inject = [];

    return ReferenceField;
});
