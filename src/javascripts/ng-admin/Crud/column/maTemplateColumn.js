/*global define*/

define(function (require) {
    'use strict';

    function maTemplateColumn() {
        return {
            restrict: 'E',
            template: '<span compile="field.getTemplateValue(entry)"></span>'
        };
    }

    maTemplateColumn.$inject = [];

    return maTemplateColumn;
});
