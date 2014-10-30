/*global define*/

define(function (require) {
    'use strict';

    var stringColumnView = require('text!../../../view/column/string.html');

    function StringColumn() {
        return {
            restrict: 'E',
            template: stringColumnView
        };
    }

    StringColumn.$inject = [];

    return StringColumn;
});
