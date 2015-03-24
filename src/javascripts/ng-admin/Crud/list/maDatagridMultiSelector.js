/*global define*/

define(function () {
    'use strict';

    function DatagridMultiSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                entries: '=',
                selection: '='
            },
            template: '<input ng-click="select(selected)" type="checkbox" ng-model="selected" class="form-control" />',
            link: function (scope, element) {
                var selection = JSON.stringify(scope.selection);
                var entries = JSON.stringify(scope.entries);

                if (selection === entries){
                    scope.selected = true;
                }
                if (selection === '[]'){
                    scope.selected = false;
                }
                if (selection !== '[]' &&selection !== entries){
                    scope.selected = null;
                    element.find('input').prop('indeterminate', true);
                }

                scope.select = function (selected) {
                    scope.selected = !selected;
                    element.find('input').prop('indeterminate', false);
                    if (!selected) {
                        scope.selection = scope.entries;
                        return;
                    }
                    scope.selection = [];
                };
            }
        };
    }

    DatagridMultiSelectorDirective.$inject = [];

    return DatagridMultiSelectorDirective;
});
