/*global define*/

define(function (require) {
    'use strict';

    var dateColumnView = require('text!../../../view/column/date.html');

    function DateColumn() {
        return {
            restrict: 'E',
            template: dateColumnView
        };
    }

    DateColumn.$inject = [];

    return DateColumn;
});
