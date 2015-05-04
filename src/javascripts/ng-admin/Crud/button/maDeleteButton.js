/*global define*/

define(function () {
    'use strict';

    function maDeleteButtonDirective($state, $stateParams) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                entry: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Delete';

                scope.gotoDelete = function () {
                    $state.go($state.get('delete'), {
                        entity: scope.entity().name(),
                        id: scope.entry().identifierValue,
                        page: $stateParams.page,
                        search: $stateParams.search,
                        sortField: $stateParams.sortField,
                        sortDir: $stateParams.sortDir
                    });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'

        };
    }

    maDeleteButtonDirective.$inject = ['$state', '$stateParams'];

    return maDeleteButtonDirective;
});
