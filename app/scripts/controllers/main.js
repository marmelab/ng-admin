'use strict';

angular
    .module('angularAdminApp')
    .controller('MainCtrl', function ($scope, configRetriever) {

        configRetriever().then(function(config) {
            $scope.global = config.global;
            $scope.entities = config.entities;
        });
    });
