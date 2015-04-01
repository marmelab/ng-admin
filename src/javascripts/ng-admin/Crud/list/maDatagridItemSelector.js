/*global define*/

define(function () {
    'use strict';

    function DatagridItemSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                selection: '=',
                toggleSelect: '&'
            },
            template: '<input type="checkbox" ng-click="toggle(entry)" ng-checked="selection.indexOf(entry) !== -1"/>',
            link: function (scope) {
                scope.toggle = function (entry) {
                    scope.toggleSelect({entry: entry});
                };
            }
        };
    }

    DatagridItemSelectorDirective.$inject = [];

    return DatagridItemSelectorDirective;
});
