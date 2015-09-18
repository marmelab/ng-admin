/**
 * Link to delete
 *
 * Usage:
 * <ma-delete-button entity="entity" entry="entry" size="xs"></ma-delete-button>
 */
function maDeleteButtonDirective($state) {
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
            var params = entityName == $state.params.entity ? $state.params : {};
            params.entity = entityName;
            params.id = scope.entry().identifierValue;
            scope.gotoDelete = () => $state.go($state.get('delete'), params);
            scope.label = scope.label || 'Delete';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoDelete()">
<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maDeleteButtonDirective.$inject = ['$state'];

module.exports = maDeleteButtonDirective;
