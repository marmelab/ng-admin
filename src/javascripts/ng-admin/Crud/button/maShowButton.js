/**
 * Link to show
 *
 * Usage:
 * <ma-show-button entity="entity" entry="entry" size="xs"></ma-show-button>
 */
export default function maShowButtonDirective($state) {
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
            scope.label = scope.label || 'SHOW';
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? { ...$state.params } : {};
            stateParams.entity = entityName;
            stateParams.id = scope.entry().identifierValue;
            scope.stateParams = stateParams;
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="show(stateParams)">
<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>
</a>`
    };
}

maShowButtonDirective.$inject = ['$state'];
