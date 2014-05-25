'use strict';

angular
    .module('angularAdminApp')
    .service('crudManager', ['$q', 'Restangular', 'configRetriever', function($q, Restangular, configRetriever) {

        /**
         * Return the edition data
         *
         * @returns {promise}
         */
        function getOne(entityName, entityId) {
            var deferred = $q.defer();

            configRetriever.getConfig().then(function(data) {
                if (!(entityName in data.entities)) {
                    return;
                }

                var entityConfig = data.entities[entityName],
                    fields = entityConfig.edit;
                Restangular.setBaseUrl(data.config.baseApiUrl);

                // Get element data
                Restangular.one(entityName, entityId).get().then(function (entity) {

                    angular.forEach(entityConfig.edit, function(field, fieldName) {
                        if (typeof(entity[fieldName]) !== "undefined") {
                            fields[fieldName].value = entity[fieldName];
                        }
                    });

                    deferred.resolve({
                        fields: fields,
                        entityLabel: entityConfig.label,
                        entityName: entityName,
                        entityId : entityId
                    });
                });

            });

            return deferred.promise;
        }


        /**
         * Return the creation data
         *
         * @returns {promise}
         */
        function createOne(entityName) {
            var deferred = $q.defer();

            var entityConfig = data.entities[entityName],
                fields = entityConfig.edit;

            deferred.resolve({
                fields: fields,
                entityLabel: entityConfig.label,
                entityName: entityName,
                entityId : entityId
            });

            return deferred.promise;
        }


        /**
         * Delete an entity
         *
         */
        function deleteOne(entityName, entityId) {
            var deferred = $q.defer();

            configRetriever.getConfig().then(function(data) {
                Restangular.setBaseUrl(data.config.baseApiUrl);

                Restangular.one(entityName, entityId).remove().then(function() {
                    deferred.resolve(true);
                }, deferred.reject);
            });

            return deferred.promise;
        }


        /**
         * Return the list data
         *
         * @returns {promise}
         */
        function getAll(entityName) {
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
            getOne: getOne,
            createOne: createOne,
            deleteOne: deleteOne,
            getAll: getAll
        };
    }]);
