/*global define*/

define(function () {
    'use strict';

    function maCreateButtonDirective($state, $stateParams) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                size: '@',
                label: '@',
            },
            link: function (scope) {
                scope.label = scope.label || 'Create';

                scope.gotoCreate = function () {
                    $state.go($state.get('create'), {
                        entity: scope.entity().name(),
                        page: $stateParams.page,
                        search: $stateParams.search,
                        sortField: $stateParams.sortField,
                        sortDir: $stateParams.sortDir
                    });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoCreate()">' +
    '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</a>'
        };
    }

    maCreateButtonDirective.$inject = ['$state', '$stateParams'];

    return maCreateButtonDirective;
});
