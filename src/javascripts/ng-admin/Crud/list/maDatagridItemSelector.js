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
            template: '<input ng-click="select(selected)" type="checkbox" ng-model="selected" class="form-control" />',
            link: function (scope) {
                scope.selected = scope.selection.indexOf(scope.entry) !== -1;

                scope.select= function (selected) {
                    scope.selected = !selected;
                    if (!selected) {
                        scope.selection.push(scope.entry);
                        return;
                    }
                    var index = scope.selection.indexOf(scope.entry);
                    scope.selection.splice(index, 1);
                };
            }
        };
    }

    DatagridItemSelectorDirective.$inject = [];

    return DatagridItemSelectorDirective;
});
