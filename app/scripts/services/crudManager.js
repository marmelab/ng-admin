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

            configRetriever()
                .then(function(data) {
                    if (!(entityName in data.entities)) {
                        return deferred.reject('Entity ' + entityName + ' not found.');
                    }

                    var entityConfig = data.entities[entityName],
                        fields = entityConfig.fields;
                    Restangular.setBaseUrl(data.config.baseApiUrl);

                    // Get element data
                    Restangular
                        .one(entityName, entityId)
                        .get()
                        .then(function (entity) {

                            angular.forEach(fields, function(field, fieldName) {
                                if(typeof(field.edition) === "undefined") {
                                    return;
                                }

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
                        }
                    );
                });

            return deferred.promise;
        }


        /**
         * Return the creation data
         *
         * @returns {promise}
         */
        function getFields(entityName, creation) {
            var deferred = $q.defer();
            creation = typeof(creation) === 'undefined' ? false : creation;

            configRetriever()
                .then(function(data) {
                    if (!(entityName in data.entities)) {
                        return deferred.reject('Entity ' + entityName + ' not found.');
                    }

                    var entityConfig = data.entities[entityName],
                        fields = filterFields(entityConfig.fields, creation);

                    deferred.resolve({
                        fields: fields,
                        entityLabel: entityConfig.label,
                        entityName: entityName
                    });
                });

            return deferred.promise;
        }


        function filterFields(fields, creation) {

            creation = typeof(creation) === 'undefined' ? false : creation;
            var filteredFields = {};

            angular.forEach(fields, function(field, fieldName){

                if(creation) {
                    if(typeof(field.edition) !== 'undefined' && field.edition === 'editable') {
                        this[fieldName] = field;
                    }
                } else {
                    if (typeof(field.edition) === 'undefined' || !field.edition) {
                        return;
                    }

                    if(field.edition === 'read-only' || field.edition === 'editable') {
                        filteredFields[fieldName] = field;
                    }
                }
            }, filteredFields);

            return filteredFields;
        }

        /**
         * Create en entity
         * @param entity
         */
        function createOne(entityName, entity) {
            var deferred = $q.defer();

            configRetriever()
                .then(function(data) {
                    if (!(entityName in data.entities)) {
                        return deferred.reject('Entity ' + entityName + ' not found.');
                    }

                    Restangular.setBaseUrl(data.config.baseApiUrl);

                    // Get element data
                    Restangular
                        .restangularizeElement(null, entity, entityName)
                        .post()
                        .then(function (entity) {
                            deferred.resolve(entity);
                        }, deferred.reject);
                });

            return deferred.promise;
        }

        /**
         * Create en entity
         * @param entity
         */
        function updateOne(entityName, entity) {
            var deferred = $q.defer();

            configRetriever()
                .then(function(data) {
                    if (!(entityName in data.entities)) {
                        return deferred.reject('Entity ' + entityName + ' not found.');
                    }

                    Restangular.setBaseUrl(data.config.baseApiUrl);

                    // Get element data
                    Restangular
                        .restangularizeElement(null, entity, entityName)
                        .put()
                        .then(function (entity) {
                            deferred.resolve(entity);
                        }, deferred.reject);
            });

            return deferred.promise;
        }


        /**
         * Delete an entity
         *
         */
        function deleteOne(entityName, entityId) {
            var deferred = $q.defer();

            configRetriever()
                .then(function(data) {
                    Restangular.setBaseUrl(data.config.baseApiUrl);

                    Restangular
                        .one(entityName, entityId)
                        .remove()
                        .then(function() {
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

            configRetriever()
                .then(function(data) {
                    if (!(entityName in data.entities)) {
                        return deferred.reject('Entity ' + entityName + ' not found.');
                    }

                    var entity = data.entities[entityName];
                    Restangular.setBaseUrl(data.config.baseApiUrl);

                    var gridOptions = {
                        data: {},
                        rowHeight: 40,
                        jqueryUITheme: true,
                        columnDefs: [],
                        label: entity.label
                    };

                    // Get grid data
                    Restangular
                        .all(entityName)
                        .getList()
                        .then(function (data) {
                            gridOptions.data = data;

                            // Get grid columns definition
                            angular.forEach(entity.fields, function(field, fieldName) {

                                if(typeof(field.list) === 'undefined' || field.list !== true) {
                                    return;
                                }

                                gridOptions.columnDefs.push({
                                    field: fieldName,
                                    displayName: field.label,
                                    cellTemplate: '/views/cells/cell-'+ field.type +'.html',
                                    sortable: true
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
            getFields: getFields,
            updateOne: updateOne,
            createOne: createOne,
            deleteOne: deleteOne,
            getAll: getAll
        };
    }]);
