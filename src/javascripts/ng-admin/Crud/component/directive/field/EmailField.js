/*global define*/

define(function (require) {
    'use strict';

    var emailFieldView = require('text!../../../view/field/email.html');

    function EmailField() {
        return {
            restrict: 'E',
            template: emailFieldView
        };
    }

    EmailField.$inject = [];

    return EmailField;
});
