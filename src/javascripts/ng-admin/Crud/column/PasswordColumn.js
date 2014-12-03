/*global define*/

define(function (require) {
    'use strict';

    var passwordColumnView = require('text!./PasswordColumn.html');

    function PasswordColumn() {
        return {
            restrict: 'E',
            template: passwordColumnView
        };
    }

    PasswordColumn.$inject = [];

    return PasswordColumn;
});
