/*global define*/

define(function (require) {
    'use strict';

    var textFieldView = require('text!./TextField.html');

    function TextField() {
        return {
            restrict: 'E',
            template: textFieldView
        };
    }

    TextField.$inject = [];

    return TextField;
});
