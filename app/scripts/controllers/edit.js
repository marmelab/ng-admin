'use strict';

angular.module('angularAdminApp').controller('EditCtrl', function ($scope, data) {
    $scope.fields = data.fields;
    $scope.entityLabel = data.entityLabel;
});
