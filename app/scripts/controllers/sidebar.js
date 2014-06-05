'use strict';

angular
    .module('angularAdminApp')
    .controller('SidebarCtrl', function ($scope, $location) {

        $scope.displayList = function(entity) {
            $location.path('/list/' + entity);
        }
    });
