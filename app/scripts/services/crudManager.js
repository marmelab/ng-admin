'use strict';

angular
    .module('angularAdminApp')
    .service('crudManager', ['$q', 'Restangular', 'getConfig', function($q, Restangular, getConfig) {

        /**
         * Get one entity
         *
         * @param {String} entityName  name of the entity
         * @param {Number} entityId       id of the entity
         *
         * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
         */
        function getOne(entityName, entityId) {
            var deferred = $q.defer(),
                entityConfig;

            getConfig()
                .then(function(config) {
                    if (!(entityName in config.entities)) {
                        return $q.reject('Entity ' + entityName + ' not found.');
                    }

                    entityConfig = config.entities[entityName],
                    Restangular.setBaseUrl(config.global.baseApiUrl);

                    // Get element data
                    return Restangular
                        .one(entityName, entityId)
                        .get();

                })
                .then(function(entity) {

                    var fields = entityConfig.fields;

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
                }, deferred.reject);

            return deferred.promise;
        }


        /**
         * Get the edition fields of an entity:
         *
         * @param {String} entityName        name of the entity
         * @param {String|Array} filterType  optional filter on the edition type (can be `read-only` or `editable`)
         *
         * @returns {promise} (list of fields & the entity name, label & id)
         */
        function getEditionFields(entityName, filterType) {
            var deferred = $q.defer(),
                filters = [];

            if (typeof(filterType) !== 'undefined') {
                if (typeof(filterType) === 'string') {
                    filters.push(filterType);
                } else if (filterType.length !== 'undefined') {
                    filters = filterType;
                }
            }

            getConfig()
                .then(function(config) {
                    if (!(entityName in config.entities)) {
                        return $q.reject('Entity ' + entityName + ' not found.');
                    }

                    var entityConfig = config.entities[entityName],
                        fields = filterEditionFields(entityConfig.fields, filters);

                    deferred.resolve({
                        fields: fields,
                        entityLabel: entityConfig.label,
                        entityName: entityName
                    });
                },
                deferred.reject);

            return deferred.promise;
        }


        /**
         * Filter a list of field to the edition fields
         *
         * @param {Object} fields  list of fields
         * @param {Array} filters  filter on the edition type
         *
         * @returns {Object} (list of the filtered fields)
         */
        function filterEditionFields(fields, filters) {
            var filteredFields = {};

            angular.forEach(fields, function(field, fieldName){
                // the field is not an edition field - do nothing
                if (typeof(field.edition) === 'undefined') {
                    return;
                }

                // if we don't specify a restriction, get all the edition fields
                if (!filters.length) {
                    return this[fieldName] = field;
                }

                // restriction to specified types fields
                if (filters.indexOf(field.edition) !== -1) {
                    return this[fieldName] = field;
                }

            }, filteredFields);

            return filteredFields;
        }

        /**
         * Create a new entity
         * Post the data to the API to create the new object
         *
         * @param {String}  entityName  the name of the entity
         * @param {Object}  entity           the entity's object
         *
         * @returns {promise}  the new object
         */
        function createOne(entityName, entity) {
            var deferred = $q.defer();

            getConfig()
                .then(function(config) {
                    if (!(entityName in config.entities)) {
                        return $q.reject('Entity ' + entityName + ' not found.');
                    }

                    Restangular.setBaseUrl(config.global.baseApiUrl);

                    // Get element data
                    return Restangular
                        .restangularizeElement(null, entity, entityName)
                        .post();

                }, deferred.reject)
                .then(deferred.resolve, deferred.reject);

            return deferred.promise;
        }

        /**
         * Update an entity
         * Put the data to the API to create the new object
         *
         * @param {String}  entityName  the name of the entity
         * @param {Object} entity           the entity's object
         *
         * @returns {promise} the updated object
         */
        function updateOne(entityName, entity) {
            var deferred = $q.defer();

            getConfig()
                .then(function(config) {
                    if (!(entityName in config.entities)) {
                        return $q.reject('Entity ' + entityName + ' not found.');
                    }

                    Restangular.setBaseUrl(config.global.baseApiUrl);

                    // Get element data
                    return Restangular
                        .restangularizeElement(null, entity, entityName)
                        .put();

                })
                .then(deferred.resolve, deferred.reject);

            return deferred.promise;
        }


        /**
         * Delete an entity
         * Delete the data to the API
         *
         * @param {String}  entityName  the name of the entity
         * @param {String}  entityid    the entity's id
         *
         * @returns {promise}
         */
        function deleteOne(entityName, entityId) {
            var deferred = $q.defer();

            getConfig()
                .then(function(config) {
                    Restangular.setBaseUrl(config.global.baseApiUrl);

                    return Restangular
                        .one(entityName, entityId)
                        .remove();

                })
                .then(deferred.resolve, deferred.reject);

            return deferred.promise;
        }


        /**
         * Return the list of all object of entityName type
         * Get all the object from the API
         *
         * @param {String}  entityName  the name of the entity
         *
         * @returns {promise} the list of objects, and the data to build the grid (to be removed)
         */
        function getAll(entityName) {
            var deferred = $q.defer(),
                entityConfig;

            getConfig()
                .then(function(config) {

                    if (!(entityName in config.entities)) {
                        return $q.reject('Entity ' + entityName + ' not found.');
                    }

                    entityConfig = config.entities[entityName];

                    Restangular.setBaseUrl(config.global.baseApiUrl);

                    // Get grid data
                    return Restangular
                        .all(entityName)
                        .getList();

                })
                .then(function (items) {
                    deferred.resolve({
                        entityName: entityName,
                        entityConfig: entityConfig,
                        rawItems: items
                    })
                }, deferred.reject);

            return deferred.promise;
        }


        return {
            getOne: getOne,
            getEditionFields: getEditionFields,
            updateOne: updateOne,
            createOne: createOne,
            deleteOne: deleteOne,
            getAll: getAll
        };
    }]);
