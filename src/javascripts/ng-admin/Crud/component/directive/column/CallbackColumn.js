/*global define*/

define(function (require) {
    'use strict';

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
