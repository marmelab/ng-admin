/*global define*/

define(function (require) {
    'use strict';

    var dateColumnView = require('text!./DateColumn.html');

    function DateColumn() {
        return {
            restrict: 'E',
            template: dateColumnView
        };
    }

    DateColumn.$inject = [];

    return DateColumn;
});
