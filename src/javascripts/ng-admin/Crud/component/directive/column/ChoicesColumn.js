define(function(require) {
    'use strict';

    var angular = require('angular');
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
