'use strict';

angular.module('angularAdminApp').controller('EditCtrl', function ($scope, $location, data) {
    $scope.fields = data.fields;
    $scope.entityLabel = data.entityLabel;

    $scope.delete = function() {
        $location.path('/delete/' + data.entityName + '/' + data.entityId);
    }

    $scope.return = function() {
        $location.path('/list/' + data.entityName);
    }
});
