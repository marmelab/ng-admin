define(function(require) {
    'use strict';

    var angular = require('angular');
    var choiceColumnView = require('text!../../../view/column/choice.html');

    function ChoiceColumn() {
        return {
            restrict: 'E',
            template: choiceColumnView
        };
    }

    ChoiceColumn.$inject = [];

    return ChoiceColumn;
});
