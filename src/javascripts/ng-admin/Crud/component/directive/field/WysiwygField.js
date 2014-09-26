define(function(require) {
    'use strict';

    var angular = require('angular');
    var wysiwygFieldView = require('text!../../../view/field/wysiwyg.html');

    function WysiwygField() {
        return {
            restrict: 'E',
            template: wysiwygFieldView
        };
    }

    WysiwygField.$inject = [];

    return WysiwygField;
});
