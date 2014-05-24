'use strict';

angular.module('angularAdminApp').controller('ListCtrl', function ($scope, data) {

    var gridOptions = data.gridOptions;

    $scope.elements = gridOptions.data
    gridOptions.data = 'elements';

    $scope.gridOptions = gridOptions;
    $scope.entityName = data.entityName;
});
