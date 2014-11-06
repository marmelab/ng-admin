define(function(require) {
    'use strict';

    var angular = require('angular');
    var callbackColumnView = require('text!../../../view/column/callback.html');

    function CallbackColumn() {
        return {
            restrict: 'E',
            template: callbackColumnView
        };
    }

    CallbackColumn.$inject = [];

    return CallbackColumn;
});
