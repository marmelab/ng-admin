/*global define*/

define(function (require) {
    'use strict';

    var textColumnView = require('text!../../../view/column/text.html');

    function TextColumn() {
        return {
            restrict: 'E',
            template: textColumnView
        };
    }

    TextColumn.$inject = [];

    return TextColumn;
});
