/*global define*/

define(function () {
    'use strict';

    function DatagridMultiSelectorDirective() {
        return {
            restrict: 'E',
            scope: {
                entries: '=',
                selection: '=',
                toggleSelectAll: '&'
            },
            template: '<input type="checkbox" ng-click="toggleSelectAll()" ng-model="selected" />',
            link: function (scope, element) {

                scope.$watch('selection', function (selection) {
                    var entries = JSON.stringify(scope.entries);
                    selection = JSON.stringify(selection);
                    if (selection === entries){
                        scope.selected = true;
                        element.find('input').prop('indeterminate', false);
                        return;
                    }
                    if (selection === '[]'){
                        scope.selected = false;
                        element.find('input').prop('indeterminate', false);
                        return;
                    }
                    if (selection !== '[]' && selection !== entries){
                        scope.selected = false;
                        element.find('input').prop('indeterminate', true);
                        return;
                    }
                });
            }
        };
    }

    DatagridMultiSelectorDirective.$inject = [];

    return DatagridMultiSelectorDirective;
});
