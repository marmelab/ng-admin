define([
    'angular',
    'config'
], function(angular, ApplicationConfig) {
    'use strict';

    function CrudManager($q, Restangular, config) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = config || ApplicationConfig;

        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers
    }

    /**
     * Get one entity
     *
     * @param {String} entityName  name of the entity
     * @param {Number} entityId    id of the entity
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    CrudManager.prototype.getOne = function(entityName, entityId) {
        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var entityConfig = this.config.getEntity(entityName),
            interceptor = entityConfig.interceptor(),
            params = entityConfig.getExtraParams();

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get element data
        return this.Restangular
            .one(entityName, entityId)
            .get(params)
            .then(function(response) {

                var fields = entityConfig.getFields(),
                    entity = response.data;

                angular.forEach(fields, function(field, index) {
                    if (field.getName() in entity) {
                        fields[index].value = field.valueTransformer()(entity[field.getName()]);
                    }
                });

                return {
                    fields: fields,
                    entityLabel: entityConfig.label(),
                    entityName: entityName,
                    entityId : entityId
                };
            });
    };


    /**
     * Get the edition fields of an entity:
     *
     * @param {String} entityName        name of the entity
     * @param {String|Array} filterType  optional filter on the edition type (can be `read-only` or `editable`)
     *
     * @returns {promise} (list of fields & the entity name, label & id)
     */
    CrudManager.prototype.getEditionFields = function(entityName, filterType) {
        var filters = [];

        if (typeof(filterType) !== 'undefined') {
            if (typeof(filterType) === 'string') {
                filters.push(filterType);
            } else if (filterType.length) {
                filters = filterType;
            }
        }

        if (!this.config.hasEntity(entityName)) {
            throw 'Entity ' + entityName + ' not found.';
        }

        var entityConfig = this.config.getEntity(entityName),
            fields = this.filterEditionFields(entityConfig.getFields(), filters);

        return {
            fields: fields,
            entityLabel: entityConfig.label(),
            entityName: entityName
        };
    };

    CrudManager.prototype.getReferencedValues = function(entityName) {
        var self = this,
            references = this.getReferences(entityName),
            calls = [];

        angular.forEach(references, function(reference) {
            calls.push(self.getAll(reference.targetEntity().getName()))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;
                angular.forEach(references, function(reference, index) {
                    references[index].setChoices(self.getReferenceChoices(reference, responses[i++].rawItems));
                });

                return references;
            });
    };

    CrudManager.prototype.getReferencedListValues = function(entityName, entityData) {
        var self = this,
            lists = this.getReferencedLists(entityName),
            entityId = entityData.entityId,
            calls = [];

        angular.forEach(lists, function(list) {
            calls.push(self.getAll(list.targetEntity().getName()))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;
                angular.forEach(lists, function(list, index) {
                    lists[index].setItems(self.filterReferencedList(responses[i++].rawItems, list, entityId));
                });

                return responses;
            });
    };

    CrudManager.prototype.filterReferencedList = function(elements, referencedList, entityId) {
        var results = [],
            targetField = referencedList.targetField();

        angular.forEach(referencedList.targetFields(), function(field) {
            results.push({
                column: {
                    label: field.label()
                }
            });
        });

        angular.forEach(elements, function(element) {
            if (element[targetField] == entityId) {
                angular.forEach(referencedList.targetFields(), function(field) {
                    results.push({
                        column: false,
                        item: element,
                        value: element[field.getName()]
                    });
                });
            }
        });

        return results;
    };

    /**
     * Returns all choices for a reference from values
     *
     * @param {Reference} reference
     * @param {Array} values
     * @returns {Object}
     */
    CrudManager.prototype.getReferenceChoices = function(reference, values) {
        var result = {},
            targetEntity = reference.targetEntity(),
            targetIdentifier = targetEntity.getIdentifier().getName();

        angular.forEach(values, function(value) {
            result[value[targetIdentifier]] = value[reference.targetLabel()];
        });

        return result;
    };

    /**
     * Returns all references of an entity
     *
     * @param {String} entityName
     * @returns {Array}
     */
    CrudManager.prototype.getReferences = function(entityName) {
        if (!this.config.hasEntity(entityName)) {
            throw ('Entity ' + entityName + ' not found.');
        }

        return this.config.getEntity(entityName).getReferences();
    };

    /**
     * Returns all referenced lists of an entity
     *
     * @param {String} entityName
     * @returns {Array}
     */
    CrudManager.prototype.getReferencedLists = function(entityName) {
        if (!this.config.hasEntity(entityName)) {
            throw ('Entity ' + entityName + ' not found.');
        }

        return this.config.getEntity(entityName).getReferencedLists();
    };


    /**
     * Filter a list of field to the edition fields
     *
     * @param {Object} fields  list of fields
     * @param {Array} filters  filter on the edition type
     *
     * @returns {Object} (list of the filtered fields)
     */
    CrudManager.prototype.filterEditionFields = function(fields, filters) {
        var filteredFields = {};

        angular.forEach(fields, function(field){
            // the field is not an edition field - do nothing
            if (!field.edition()) {
                return;
            }

            // if we don't specify a restriction, get all the edition fields
            if (!filters.length) {
                return this[field.getName()] = field;
            }

            // restriction to specified types fields
            if (filters.indexOf(field.edition()) !== -1) {
                return this[field.getName()] = field;
            }

        }, filteredFields);

        return filteredFields;
    };

    /**
     * Create a new entity
     * Post the data to the API to create the new object
     *
     * @param {String}  entityName  the name of the entity
     * @param {Object}  entity      the entity's object
     *
     * @returns {promise}  the new object
     */
    CrudManager.prototype.createOne = function (entityName, entity) {
        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        // Get element data
        return this.Restangular
            .restangularizeElement(null, entity, entityName)
            .post();
    };

    /**
     * Update an entity
     * Put the data to the API to create the new object
     *
     * @param {String}  entityName  the name of the entity
     * @param {Object} entity           the entity's object
     *
     * @returns {promise} the updated object
     */
    CrudManager.prototype.updateOne = function(entityName, entity) {
        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        // Get element data
        return this.Restangular
            .restangularizeElement(null, entity, entityName)
            .put();
    };


    /**
     * Delete an entity
     * Delete the data to the API
     *
     * @param {String}  entityName  the name of the entity
     * @param {String}  entityId    the entity's id
     *
     * @returns {promise}
     */
    CrudManager.prototype.deleteOne = function(entityName, entityId) {
        return this.Restangular
            .one(entityName, entityId)
            .remove();
    };


    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {String}  entityName  the name of the entity
     * @param {Number}  page        the page number
     *
     * @returns {promise} the entity config & the list of objects
     */
    CrudManager.prototype.getAll = function (entityName, page, limit) {
        page = (typeof(page) === 'undefined') ? 1 : parseInt(page);

        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var self = this,
            entityConfig = this.config.getEntity(entityName),
            fields = entityConfig.getFields(),
            pagination = entityConfig.pagination(),
            perPage = limit || entityConfig.perPage(),
            interceptor = entityConfig.interceptor(),
            params = entityConfig.getExtraParams(),
            response;

        if (pagination) {
            params = angular.extend(params, pagination(page, perPage));
        }
        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get grid data
        return this.Restangular
            .all(entityConfig.getName())
            .getList(params)
            .then(function (data) {
                response = data;

                return self.getReferencedValues(entityName);
            })
            .then(function(referencedValues) {
                var entities = response.data;

                for (var i = 0, l = entities.length; i < l; i++) {
                    var entity = entities[i];

                    angular.forEach(fields, function(field, fieldName) {
                        if (field.getName() in entity) {
                            entities[i][fieldName] = field.valueTransformer()(entity[field.getName()]);
                        }
                    });
                }

                return {
                    entityName: entityName,
                    entityConfig: entityConfig,
                    rawItems: self.fillReferencesValuesFromCollection(entities, referencedValues),
                    currentPage: page,
                    perPage: perPage,
                    totalItems: entityConfig.totalItems()(response)
                };
            });
    };

    CrudManager.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues) {
        angular.forEach(referencedValues, function(reference, referenceField) {
            var choices = reference.getChoices();

            for (var i = 0, l = collection.length; i < l; i++) {
                var element = collection[i],
                    identifier = reference.valueTransformer()(element[referenceField]);

                if (identifier && identifier in choices) {
                    element[referenceField] = choices[identifier];
                } else {
                    delete element[referenceField];
                }
            }
        });

        return collection;
    };

    CrudManager.$inject = ['$q', 'Restangular'];

    return CrudManager;
});
