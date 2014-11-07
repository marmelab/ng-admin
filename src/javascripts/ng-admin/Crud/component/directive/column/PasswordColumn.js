define(function(require) {
    'use strict';

    var angular = require('angular');
    var passwordColumnView = require('text!../../../view/column/password.html');

    function PasswordColumn() {
        return {
            restrict: 'E',
            template: passwordColumnView
        };
    }

    PasswordColumn.$inject = [];

    return PasswordColumn;
});
