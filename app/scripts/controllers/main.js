'use strict';

angular
    .module('angularAdminApp')
    .controller('MainCtrl', function ($scope, getConfig) {

        getConfig().then(function(config) {
            $scope.global = config.global;
            $scope.entities = config.entities;
        });
    });
