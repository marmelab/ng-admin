define([
    'app',
    '../../scripts/services/crudManager'
], function(app) {
    'use strict';

    app.controller('DeleteCtrl', function ($scope, $location, crudManager, params) {
        $scope.deleteOne = function() {
            crudManager.deleteOne(params.entity, params.id).then(function() {
                $location.path('/list/' + params.entity);
            });
        };

        $scope.back = function() {
            $location.path('/edit/' + params.entity + '/' + params.id);
        }
    });
});
