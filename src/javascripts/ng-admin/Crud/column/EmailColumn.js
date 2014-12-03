/*global define*/

define(function (require) {
    'use strict';

    var emailColumnView = require('text!./EmailColumn.html');

    function EmailColumn() {
        return {
            restrict: 'E',
            template: emailColumnView
        };
    }

    EmailColumn.$inject = [];

    return EmailColumn;
});
