/**
 * Link to show
 *
 * Usage:
 * <ma-show-button entity="entity" entry="entry" size="xs"></ma-show-button>
 */
function maShowButtonDirective($state) {
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
            scope.gotoShow = () => $state.go($state.get('show'), params);
            scope.label = scope.label || 'Show';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoShow()">
<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label }}</span>
</a>`
    };
}

maShowButtonDirective.$inject = ['$state'];

module.exports = maShowButtonDirective;
