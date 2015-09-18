/**
 * Link to list
 *
 * Usage:
 * <ma-list-button entity="entity" size="xs"></ma-list-button>
 */
function maListButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            size: '@',
            label: '@',
        },
        link: function (scope, element, attrs) {
            scope.gotoList = () => {
                var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
                var params = entityName == $state.params.entity ? $state.params : {};
                params.entity = entityName;
                $state.go($state.get('list'), params);
            }
            scope.label = scope.label || 'List';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoList()">
<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maListButtonDirective.$inject = ['$state'];

module.exports = maListButtonDirective;
