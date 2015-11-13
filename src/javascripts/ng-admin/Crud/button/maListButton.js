/**
 * Link to list
 *
 * Usage:
 * <ma-list-button entity="entity" size="xs"></ma-list-button>
 */
export default function maListButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            size: '@',
            label: '@',
        },
        link: function (scope, element, attrs) {
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? { ...$state.params } : {};
            stateParams.entity = entityName;
            scope.stateParams = stateParams;
            scope.label = scope.label || 'List';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="list(stateParams)">
<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maListButtonDirective.$inject = ['$state'];
