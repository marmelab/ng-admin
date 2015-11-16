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
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? { ...$state.params } : {};
            stateParams.entity = entityName;
            stateParams.id = scope.entry().identifierValue;
            scope.stateParams = stateParams;
            scope.label = scope.label || 'Edit';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="edit(stateParams)">
<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maEditButtonDirective.$inject = ['$state'];
