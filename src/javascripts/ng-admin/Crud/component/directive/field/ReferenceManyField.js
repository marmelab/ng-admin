define(function(require) {
    'use strict';

    var angular = require('angular');
    var referenceManyFieldView = require('text!../../../view/field/referenceMany.html');

    function ReferenceManyField() {
        return {
            restrict: 'E',
            template: referenceManyFieldView
        };
    }

    ReferenceManyField.$inject = [];

    return ReferenceManyField;
});
