define(function(require) {
    'use strict';

    var angular = require('angular');
    var callbackFieldView = require('text!../../../view/field/callback.html');

    function CallbackField() {
        return {
            restrict: 'E',
            template: callbackFieldView
        };
    }

    CallbackField.$inject = [];

    return CallbackField;
});
