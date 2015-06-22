function maFilterButtonDirective() {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            filters: '&',
            enabledFilters: '='
        },
        link: function(scope) {
            scope.notYetEnabledFilters = () => scope.filters().filter(filter => 
                scope.enabledFilters.indexOf(filter) === -1
            );
            scope.hasFilters = () => scope.notYetEnabledFilters().length > 0;
            scope.enableFilter = filter => scope.enabledFilters.push(filter);
        },
        template:
`<span class="btn-group" dropdown is-open="isopen" ng-if="hasFilters()">
    <button type="button" class="btn btn-default dropdown-toggle" dropdown-toggle >
        <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>&nbsp;
        Add filter <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" role="menu">
        <li ng-repeat="filter in notYetEnabledFilters()" ng-switch="button">
            <a ng-click="enableFilter(filter)">{{ filter.label() }}</a>
        </li>
    </ul>
</span>`
    };
}

maFilterButtonDirective.$inject = [];

module.exports = maFilterButtonDirective;
