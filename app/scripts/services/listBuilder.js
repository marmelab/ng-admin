'use strict';

angular
    .module('angularAdminApp')
    .service('listBuilder', ['$q', 'Restangular', 'configRetriever', function($q, Restangular, configRetriever) {

        /**
         * Return the list data
         *
         * @returns {promise}
         */
        function getListData(entityName) {
            var deferred = $q.defer();

            configRetriever.getConfig().then(function(data) {
                if (!(entityName in data.entities)) {
                    return;
                }

                var entity = data.entities[entityName];
                Restangular.setBaseUrl(data.config.baseApiUrl);

                var gridOptions = {
                    data: {},
                    columnDefs: [],
                    label: entity.label
                };

                // Get grid data
                Restangular.all(entityName).getList().then(function (data) {
                    gridOptions.data = data;

                    // Get grid columns definition
                    angular.forEach(entity.list, function(field, fieldName) {
                        gridOptions.columnDefs.push({
                            field: fieldName,
                            displayName: field.label,
                            cellTemplate: '<a ng-click="edit(row)">{{row.getProperty(col.field)}}</a>'
                        });
                    });

                    deferred.resolve({
                        entityName: entityName,
                        entityLabel: entity.label,
                        gridOptions: gridOptions
                    })
                });
            });

            return deferred.promise;
        }

        return {
            getListData: getListData
        };
    }]);
