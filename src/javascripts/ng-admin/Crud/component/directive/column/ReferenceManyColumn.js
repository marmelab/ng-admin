/*global define*/

define(function (require) {
    'use strict';

    var referenceManyColumnView = require('text!../../../view/column/referenceMany.html');

    function ReferenceManyColumn() {
        return {
            restrict: 'E',
            template: referenceManyColumnView
        };
    }

    ReferenceManyColumn.$inject = [];

    return ReferenceManyColumn;
});
