define(function(require) {
    'use strict';

    var angular = require('angular');
    var referenceColumnView = require('text!../../../view/column/reference.html');

    function ReferenceColumn() {
        return {
            restrict: 'E',
            template: referenceColumnView
        };
    }

    ReferenceColumn.$inject = [];

    return ReferenceColumn;
});
