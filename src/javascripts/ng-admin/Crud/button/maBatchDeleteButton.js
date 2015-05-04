/*global define*/

define(function () {
    'use strict';

    function maBatchDeleteButtonDirective($state, $stateParams) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                selection: '&',
                label: '@',
            },
            link: function ($scope) {
                $scope.label = $scope.label || 'Delete';

                $scope.gotoBatchDelete = function () {
                    var entity = $scope.entity();
                    var ids = $scope.selection().map(function(entry) {
                        return entry.identifierValue;
                    });
                    $state.go('batchDelete', {
                        ids: ids,
                        entity: entity.name(),
                        page: $stateParams.page,
                        search: $stateParams.search,
                        sortField: $stateParams.sortField,
                        sortDir: $stateParams.sortDir
                    });
                };
            },
            template:
'<span ng-click="gotoBatchDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;{{ ::label }}' +
'</span>'

        };
    }

    maBatchDeleteButtonDirective.$inject = ['$state', '$stateParams'];

    return maBatchDeleteButtonDirective;
});
