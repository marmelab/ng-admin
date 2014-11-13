/*global define*/

define(function (require) {
    'use strict';

    var templateColumnView = require('text!../../../view/column/template.html');

    function TemplateColumn() {
        return {
            restrict: 'E',
            template: templateColumnView
        };
    }

    TemplateColumn.$inject = [];

    return TemplateColumn;
});
