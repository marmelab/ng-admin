/*global define*/

define(function (require) {
    'use strict';

    var templateFieldView = require('text!../../../view/field/template.html');

    function TemplateField() {
        return {
            restrict: 'E',
            template: templateFieldView
        };
    }

    TemplateField.$inject = [];

    return TemplateField;
});
