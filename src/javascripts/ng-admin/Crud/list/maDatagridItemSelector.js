/*global define*/

define(function () {
    'use strict';

    function DatagridItemSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                entry: '=',
                selection: '='
            },
            template: '<input type="checkbox" ng-click="select()" ng-model="selected"/>',
            link: function (scope) {
                var selected;

                scope.$watch('selection', function (selection) {
                    selected = selection.indexOf(scope.entry) !== -1;
                    scope.selected = selected;
                });

                scope.select = function () {
                    selected = !selected;
                    if (selected) {
                        scope.selection = scope.selection.concat(scope.entry);
                        return;
                    }
                    var index = scope.selection.indexOf(scope.entry);
                    scope.selection.splice(index, 1);
                    scope.selection = scope.selection.slice();
                };
            }
        };
    }

    DatagridItemSelectorDirective.$inject = [];

    return DatagridItemSelectorDirective;
});
