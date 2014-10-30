/*global define*/

define(function (require) {
    'use strict';

    var choicesColumnView = require('text!../../../view/column/choices.html');

    function ChoicesColumn() {
        return {
            restrict: 'E',
            template: choicesColumnView
        };
    }

    ChoicesColumn.$inject = [];

    return ChoicesColumn;
});
