'use strict';

angular
    .module('angularAdminApp')
    .controller('HomeCtrl', function ($scope, $location, panelBuilder) {

        panelBuilder.getPanelsData().then(function(panels) {

            $scope.panels = {};

            angular.forEach(panels, function(panel) {

                var entityConfig = panel.entityConfig,
                    rawItems = panel.rawItems,
                    columns = [],
                    identifierField = 'id';

                // Get identifier field, and build columns array (only field defined with `"list" : true` in config file)
                angular.forEach(entityConfig.fields, function(field, fieldName) {

                    if(typeof(field.identifier) !== 'undefined') {
                        identifierField = fieldName;
                    }
                    if(typeof(field.dashboard) === 'undefined' || field.dashboard !== true) {
                        return;
                    }

                    columns.push({
                        field: fieldName,
                        label: field.label
                    });
                });

                $scope.panels[panel.entityName] = {
                    label: panel.entityConfig.label,
                    columns: columns,
                    items: rawItems,
                    identifierField: identifierField,
                    options: {
                        grid : {
                            dimensions : [ columns.length, rawItems.length ]
                        }
                    }
                };
            })

            $scope.edit = function(entityName, identifier, item) {
                $location.path('/edit/' + entityName + '/' + item[identifier]);
            };
        });
    });
