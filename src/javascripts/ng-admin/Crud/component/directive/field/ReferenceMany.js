define(function(require) {
    'use strict';

    var angular = require('angular');
    var referenceManyFieldView = require('text!../../../view/field/referenceMany.html');

    function ReferenceMany() {
        return {
            restrict: 'E',
            template: referenceManyFieldView
        };
    }

    ReferenceMany.$inject = [];

    return ReferenceMany;
});
