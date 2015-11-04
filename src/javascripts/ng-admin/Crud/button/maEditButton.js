/**
 * Link to edit
 *
 * Usage:
 * <ma-edit-button entity="entity" entry="entry" size="xs"></ma-edit-button>
 */
export default function maEditButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            entry: '&',
            size: '@',
            label: '@',
        },
        link: function (scope, element, attrs) {
            scope.gotoEdit = () => {
                var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
                var params = entityName == $state.params.entity ? $state.params : {};
                params.entity = entityName;
                params.id = scope.entry().identifierValue;
                $state.go($state.get('edit'), params);
            }
            scope.label = scope.label || 'Edit';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoEdit()">
<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maEditButtonDirective.$inject = ['$state'];
