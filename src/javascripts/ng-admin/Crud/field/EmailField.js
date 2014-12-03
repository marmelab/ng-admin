/*global define*/

define(function (require) {
    'use strict';

    var emailFieldView = require('text!./EmailField.html');

    function EmailField() {
        return {
            restrict: 'E',
            template: emailFieldView
        };
    }

    EmailField.$inject = [];

    return EmailField;
});
