/*global define*/

define(function (require) {
    'use strict';

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
