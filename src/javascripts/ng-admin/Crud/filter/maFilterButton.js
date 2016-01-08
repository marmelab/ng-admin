export default function maFilterButton() {
    return {
        restrict: 'E',
        scope: {
            filters: '&',
            enabledFilters: '=',
            enableFilter: '&'
        },
        link: function(scope) {
            scope.notYetEnabledFilters = () => scope.filters().filter(filter =>
                scope.enabledFilters.indexOf(filter) === -1
            );
            scope.hasFilters = () => scope.notYetEnabledFilters().length > 0;
        },
        template:
`<span class="btn-group" uib-dropdown is-open="isopen" ng-if="hasFilters()">
    <button type="button" class="btn btn-default dropdown-toggle" uib-dropdown-toggle >
        <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">Add filter </span><span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
        <li ng-repeat="filter in notYetEnabledFilters()" ng-switch="button">
            <a ng-click="enableFilter()(filter)">{{ filter.label() }}</a>
        </li>
    </ul>
</span>`
    };
}

maFilterButton.$inject = [];
