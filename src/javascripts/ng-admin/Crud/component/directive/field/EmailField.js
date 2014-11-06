define(function(require) {
    'use strict';

    var angular = require('angular');
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
