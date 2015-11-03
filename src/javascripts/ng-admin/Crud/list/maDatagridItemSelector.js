export default function maDatagridItemSelector() {
    return {
        restrict: 'E',
        scope: {
            entry: '=',
            selection: '=',
            toggleSelect: '&'
        },
        template: '<input type="checkbox" ng-click="toggle(entry)" ng-checked="isInSelection()"/>',
        link: function (scope) {
            scope.toggle = entry => scope.toggleSelect({entry: entry});
            let e = scope.entry;
            scope.isInSelection = () => scope.selection.filter(s => s._entityName == e._entityName && s._identifierValue == e._identifierValue).length > 0;
        }
    };
}

maDatagridItemSelector.$inject = [];
