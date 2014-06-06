define([
    'app'
], function(app) {
    'use strict';

    app.controller('SidebarCtrl', function ($scope, $location) {
        $scope.displayList = function(entity) {
            $location.path('/list/' + entity);
        }
    });
});
