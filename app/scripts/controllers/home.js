'use strict';

angular
    .module('angularAdminApp')
    .controller('HomeCtrl', function ($scope, panels) {

        $scope.panels = {};

        angular.forEach(panels, function(panel, entity) {

            $scope[entity + 'data'] = panel.data;

            $scope.panels[entity] = {
                label: panel.label,
                gridOptions: {
                    data: entity + 'data',
                    columnDefs: panels[entity].columnDefs
                }
            };
        })
    });
