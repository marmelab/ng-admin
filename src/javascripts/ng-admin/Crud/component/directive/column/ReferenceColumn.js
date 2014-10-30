/*global define*/

define(function (require) {
    'use strict';

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
