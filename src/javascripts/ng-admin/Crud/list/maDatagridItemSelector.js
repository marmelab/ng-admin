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
            template: '<input type="checkbox" ng-click="toggle(entry)" ng-model="selected"/>',
            link: function (scope) {

                scope.toggle = function (entry) {
                    scope.toggleSelect({entry: entry});
                };

                scope.$watch('selection', function (selection) {
                    scope.selected = selection.indexOf(scope.entry) !== -1;
                });

            }
        };
    }

    DatagridItemSelectorDirective.$inject = [];

    return DatagridItemSelectorDirective;
});
