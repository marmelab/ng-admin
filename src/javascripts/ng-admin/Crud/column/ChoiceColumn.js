/*global define*/

define(function (require) {
    'use strict';

    var choiceColumnView = require('text!./ChoiceColumn.html');

    function ChoiceColumn() {
        return {
            restrict: 'E',
            template: choiceColumnView
        };
    }

    ChoiceColumn.$inject = [];

    return ChoiceColumn;
});
