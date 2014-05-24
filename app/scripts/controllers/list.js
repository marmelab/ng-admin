'use strict';

angular.module('angularAdminApp').controller('ListCtrl', function ($scope, $location, data) {

    var gridOptions = data.gridOptions;

    $scope.elements = gridOptions.data
    gridOptions.data = 'elements';

    $scope.gridOptions = gridOptions;
    $scope.entityLabel = data.entityLabel;

    $scope.edit = function(row) {
        $location.path('/edit/' + data.entityName + '/' + row.entity.id);
    }
});
