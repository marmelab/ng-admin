define(function(require) {
    'use strict';

    var angular = require('angular');
    var passwordFieldView = require('text!../../../view/field/password.html');

    function PasswordField() {
        return {
            restrict: 'E',
            template: passwordFieldView
        };
    }

    PasswordField.$inject = [];

    return PasswordField;
});
