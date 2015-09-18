/**
 * Link to create
 *
 * Usage:
 * <ma-create-button entity="entity" default-values="{}" size="xs"></ma-create-button>
 */
function maCreateButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            defaultValues: '&',
            size: '@',
            label: '@',
        },
        link: function (scope, element, attrs) {
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var params = entityName == $state.params.entity ? $state.params : {};
            params.entity = entityName;
            params.defaultValues = scope.defaultValues();
            scope.gotoCreate = () => $state.go($state.get('create'), params);
            scope.label = scope.label || 'Create';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoCreate()">
<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maCreateButtonDirective.$inject = ['$state'];

module.exports = maCreateButtonDirective;
