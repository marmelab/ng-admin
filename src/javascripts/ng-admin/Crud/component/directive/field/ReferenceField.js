/*global define*/

define(function (require) {
    'use strict';

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
