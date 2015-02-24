/*global define*/

define(function (require) {
    'use strict';

    function maWysiwygColumn($filter) {
        return {
            restrict: 'E',
            scope: {
                value: '&',
                field: '&'
            },
            link: function(scope) {
                var value = scope.value();
                if (scope.field().stripTags()) {
                    value = $filter('stripTags')(value);
                }
                scope.htmlValue = value;
            },
            template: '<span ng-bind-html="htmlValue"></span>'
        };
    }

    maWysiwygColumn.$inject = ['$filter'];

    return maWysiwygColumn;
});
