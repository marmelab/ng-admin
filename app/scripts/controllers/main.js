define([
    'app',
    '../../scripts/services/getConfig'
], function(app) {
    'use strict';

    app.controller('MainCtrl', function ($scope, getConfig) {
        getConfig().then(function(config) {
            $scope.global = config.global;
            $scope.entities = config.entities;
        });
    });
});
