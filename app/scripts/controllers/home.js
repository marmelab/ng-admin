'use strict';

angular
    .module('angularAdminApp')
    .controller('HomeCtrl', function ($scope, panelBuilder) {

        panelBuilder.getPanelsData().then(function(panels) {

            $scope.panels = {};

            angular.forEach(panels, function(panel) {

                $scope[panel.name + 'data'] = panel.data;

                $scope.panels[panel.name] = {
                    label: panel.label,
                    gridOptions: {
                        data: panel.name + 'data',
                        columnDefs: panel.columnDefs
                    }
                };
            })
        });
    });
