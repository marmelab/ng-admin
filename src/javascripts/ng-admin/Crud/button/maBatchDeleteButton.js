/*global define*/

define(function () {
    'use strict';

    function maBatchDeleteButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'selection': '&',
            },
            link: function ($scope) {
                $scope.gotoBatchDelete = function () {
                    var entity = $scope.entity();
                    var ids = $scope.selection().map(function(entry) {
                        return entry.identifierValue
                    });
                    $state.go('batchDelete', { ids: ids, entity: entity.name() });
                };
            },
            template:
'<span ng-click="gotoBatchDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;Delete' +
'</span>'

        };
    }

    maBatchDeleteButtonDirective.$inject = ['$state'];

    return maBatchDeleteButtonDirective;
});
