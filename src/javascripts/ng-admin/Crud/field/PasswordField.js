/*global define*/

define(function (require) {
    'use strict';

    var passwordFieldView = require('text!./PasswordField.html');

    function PasswordField() {
        return {
            restrict: 'E',
            template: passwordFieldView
        };
    }

    PasswordField.$inject = [];

    return PasswordField;
});
