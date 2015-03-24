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
            template: '<input type="checkbox" ng-click="select()" ng-model="selected" />',
            link: function (scope, element) {
                var entries = JSON.stringify(scope.entries);
                var selected;

                scope.$watch('selection', function (selection) {
                    selection = JSON.stringify(selection);
                    if (selection === entries){
                        selected = true;
                        element.find('input').prop('indeterminate', false);
                    }
                    if (selection === '[]'){
                        selected = false;
                        element.find('input').prop('indeterminate', false);
                    }
                    if (selection !== '[]' && selection !== entries){
                        selected = false;
                        element.find('input').prop('indeterminate', true);
                    }
                    scope.selected = selected;
                });

                scope.select = function () {
                    selected = !selected;
                    if (selected) {
                        scope.selection = scope.entries.slice();
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
