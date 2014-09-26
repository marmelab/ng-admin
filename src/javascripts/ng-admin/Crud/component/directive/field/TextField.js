define(function(require) {
    'use strict';

    var angular = require('angular');
    var textFieldView = require('text!../../../view/field/text.html');

    function TextField() {
        return {
            restrict: 'E',
            template: textFieldView
        };
    }

    TextField.$inject = [];

    return TextField;
});
