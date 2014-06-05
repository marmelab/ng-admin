'use strict';

angular.module('angularAdminApp').controller('DeleteCtrl', function ($scope, $location, crudManager, params) {

    $scope.delete = function() {
        crudManager.deleteOne(params.entity, params.id).then(function() {
            $location.path('/list/' + params.entity);
        });
    }

    $scope.return = function() {
        $location.path('/edit/' + params.entity + '/' + params.id);
    }
});
