export default function DatagridMultiSelectorDirective() {
    return {
        restrict: 'E',
        scope: {
            entries: '=',
            selection: '=',
            toggleSelectAll: '&'
        },
        template: '<input type="checkbox" ng-click="toggleSelectAll()" ng-checked="selection.length == entries.length" />',
        link: function (scope, element) {
            scope.$watch('selection', function (selection) {
                element.children()[0].indeterminate = selection.length > 0 && selection.length != scope.entries.length;
            });
            scope.$watch('entries', function (entries) {
                element.children()[0].indeterminate = scope.selection.length > 0 && scope.selection.length != entries.length;
            });
        }
    };
}

DatagridMultiSelectorDirective.$inject = [];
