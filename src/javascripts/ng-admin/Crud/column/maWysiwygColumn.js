/*global define*/

define(function (require) {
    'use strict';

    function maWysiwygColumn() {
        return {
            restrict: 'E',
            scope: {
                value: '&'
            },
            template: '<span ng-bind-html="value()"></span>'
        };
    }

    maWysiwygColumn.$inject = [];

    return maWysiwygColumn;
});
