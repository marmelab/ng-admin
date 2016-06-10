export default function maFilterButton() {
    return {
        restrict: 'E',
        scope: {
            filters: '&',
            enabledFilters: '=',
            enableFilter: '&',
            label: "@",
        },
        link: function(scope) {
            scope.label = scope.label || 'ADD_FILTER';
            scope.notYetEnabledFilters = () => scope.filters().filter(filter =>
                scope.enabledFilters.indexOf(filter) === -1
            );
            scope.hasFilters = () => scope.notYetEnabledFilters().length > 0;
        },
        template:
`<span class="btn-group" uib-dropdown is-open="isopen" ng-if="hasFilters()">
    <button type="button" class="btn btn-default dropdown-toggle" uib-dropdown-toggle >
        <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;<span class="hidden-xs" translate="{{ ::label }}"></span>&nbsp;<span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
        <li ng-repeat="filter in notYetEnabledFilters()" ng-switch="button">
            <a ng-click="enableFilter()(filter)">{{ filter.label() | translate }}</a>
        </li>
    </ul>
</span>`
    };
}

maFilterButton.$inject = [];
