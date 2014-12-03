/*global define*/

define(function (require) {
    'use strict';

    var templateColumnView = require('text!./TemplateColumn.html');

    function TemplateColumn() {
        return {
            restrict: 'E',
            template: templateColumnView
        };
    }

    TemplateColumn.$inject = [];

    return TemplateColumn;
});
