/*global define*/

define(function () {
    'use strict';

    var compareArray = function (a1, a2) {
        if (a2.length !== a1.length) {
            return false;
        }

        return a1.reduce(function (prev, cur) {
            if(prev === false) { return prev; }
            return a2.indexOf(cur) !== -1;
        }, true);
    };

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

                function updateState(selection, entries) {
                    var equal = compareArray(entries, selection);

                    if (equal){
                        scope.selected = true;
                        element.find('input').prop('indeterminate', false);
                        return;
                    }
                    if (selection.length === 0){
                        scope.selected = false;
                        element.find('input').prop('indeterminate', false);
                        return;
                    }
                    if (selection !== '[]' && !equal){
                        scope.selected = false;
                        element.find('input').prop('indeterminate', true);
                        return;
                    }
                }

                scope.$watch('selection', function (selection) {
                    updateState(selection, scope.entries);
                });
                scope.$watch('entries', function (entries) {
                    updateState(scope.selection, entries);
                });
            }
        };
    }

    DatagridMultiSelectorDirective.$inject = [];

    return DatagridMultiSelectorDirective;
});
