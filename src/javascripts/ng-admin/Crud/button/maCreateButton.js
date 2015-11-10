/**
 * Link to create
 *
 * Usage:
 * <ma-create-button entity="entity" default-values="{}" size="xs"></ma-create-button>
 */
export default function maCreateButtonDirective($state) {
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
            scope.gotoCreate = () => {
                var entityName;
                if (attrs.force === "true"){
                  entityName = attrs.entity;
                }
                else {
                  entityName = scope.entity() ? scope.entity().name() : attrs.entity;
                }
                var params = entityName === $state.params.entity ? $state.params : {};
                params.entity = entityName;
                params.defaultValues = scope.defaultValues();
                $state.go($state.get('create'), params);
            };
            scope.label = scope.label || 'Create';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoCreate()">
<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maCreateButtonDirective.$inject = ['$state'];
