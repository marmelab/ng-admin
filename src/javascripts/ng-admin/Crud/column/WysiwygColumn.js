/*global define*/

define(function (require) {
    'use strict';

    var wysiwygColumnView = require('text!./WysiwygColumn.html');

    function WysiwygColumn() {
        return {
            restrict: 'E',
            template: wysiwygColumnView
        };
    }

    WysiwygColumn.$inject = [];

    return WysiwygColumn;
});
