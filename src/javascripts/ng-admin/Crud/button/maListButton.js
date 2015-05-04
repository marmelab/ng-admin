/*global define*/

define(function () {
    'use strict';

    /**
     * Link to list
     *
     * Usage:
     * <ma-list-button entity="entity" size="xs"></ma-list-button>
     */
    function maListButtonDirective($state, $stateParams) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'List';

                scope.gotoList = function () {
                    $state.go($state.get('list'), {
                        entity: scope.entity().name(),
                        search: $stateParams.search,
                        page: $stateParams.page,
                        sortDir: $stateParams.sortDir,
                        sortField: $stateParams.sortField
                    });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoList()">' +
    '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'
        };
    }

    maListButtonDirective.$inject = ['$state', '$stateParams'];

    return maListButtonDirective;
});
