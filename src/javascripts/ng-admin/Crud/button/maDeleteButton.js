/*global define*/

define(function () {
    'use strict';

    function maDeleteButtonDirective($state) {
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
                        page: $state.params.page,
                        search: $state.params.search,
                        sortField: $state.params.sortField,
                        sortDir: $state.params.sortDir
                    });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'

        };
    }

    maDeleteButtonDirective.$inject = ['$state'];

    return maDeleteButtonDirective;
});
