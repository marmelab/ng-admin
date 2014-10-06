define(function(require) {
    'use strict';

    var angular = require('angular');

    /**
     *
     * @param {$q} $q
     * @param {Restangular} Restangular
     * @param {Application} Configuration
     * @constructor
     */
    function CrudManager($q, Restangular, Configuration, Field) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = Configuration();
        this.Field = Field;

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
            params = entityConfig.getExtraParams(),
            headers = this.config.getHeaders(entityName, 'getOne');

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get element data
        return this.Restangular
            .one(entityName, entityId)
            .get(params, headers)
            .then(function(response) {

                var fields = entityConfig.getFields(),
                    entity = response.data;

                // Transform each values with `valueTransformer`
                angular.forEach(fields, function(field, index) {
                    entityConfig.getField(index).value = field.valueTransformer()(entity[field.name()]);
                });

                return entityConfig;
            });
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

        var headers = this.config.getHeaders(entityName, 'createOne');

        // Get element data
        return this.Restangular
            .restangularizeElement(null, entity, entityName)
            .post(null, headers);
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

        var headers = this.config.getHeaders(entityName, 'updateOne');

        // Get element data
        return this.Restangular
            .restangularizeElement(null, entity, entityName)
            .put(null, headers);
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
        var headers = this.config.getHeaders(entityName, 'deleteOne');

        return this.Restangular
            .one(entityName, entityId)
            .remove(null, headers);
    };


    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {String}       entityName          the name of the entity
     * @param {Number}       page                the page number
     * @param {Number|Bool}  limit               the pagination limit
     * @param {Boolean}      fillSimpleReference should we fill Reference list
     * @param {String}       query               searchQuery to filter elements
     * @param {String}       sortField           the field to be sorted ex: entity.fieldName
     * @param {String}       sortDir             the direction of the sort
     * @param {Object}       filters             filter specific fields
     *
     * @returns {promise} the entity config & the list of objects
     */
    CrudManager.prototype.getAll = function (entityName, page, limit, fillSimpleReference, query, sortField, sortDir, filters) {
        page = (typeof(page) === 'undefined') ? 1 : parseInt(page);
        fillSimpleReference = (typeof(fillSimpleReference) === 'undefined') ? true : fillSimpleReference;
        filters = (typeof(filters) === 'undefined') ? {} : filters;

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
            headers = this.config.getHeaders(entityName, 'getAll'),
            sortEntity = sortField ? sortField.split('.')[0] : '',
            sortParams = sortEntity === entityName ? entityConfig.getSortParams(sortField.split('.').pop(), sortDir) : null,
            response;

        filters = entityConfig.filterParams()(filters);

        // Add sort param headers
        if (sortParams && sortParams.headers) {
            headers = angular.extend(headers, sortParams.headers);
        }

        // Add pagination params
        if (pagination && limit !== false) {
            params = angular.extend(params, pagination(page, perPage));
        }

        // Add sort params
        if (sortParams && 'params' in sortParams) {
            params = angular.extend(params, sortParams.params);
        }

        // Add query params
        if (query && query.length) {
            var filterQuery = entityConfig.filterQuery();
            params = angular.extend(params, filterQuery(query));
        }

        // Add filters
        angular.forEach(filters, function(value, fieldName) {
            params[fieldName] = value;
        });

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get grid data
        return this.Restangular
            .all(entityConfig.name())
            .getList(params, headers)
            .then(function (data) {
                response = data;

                return self.getReferencedValues(entityName);
            })
            .then(function(referencedValues) {
                var rawEntities = response.data,
                    entities = [];

                // Map each rawEntity to an Entity
                for (var i = 0, l = rawEntities.length; i < l; i++) {
                    var rawEntity = rawEntities[i],
                        entity = angular.copy(entityConfig);

                    angular.forEach(fields, function(field, fieldName) {

                        if (field.type() === 'callback') {
                            entity.getField(fieldName).value = field.getCallbackValue(rawEntity);
                        }else if (field.name() in rawEntity) {
                            entity.getField(fieldName).value = field.valueTransformer()(rawEntity[field.name()]);
                        }
                    });

                    entities.push(entity);
                }

                entities = self.fillReferencesValuesFromCollection(entities, referencedValues, fillSimpleReference);
                entities = self.truncateListValue(entities);

                return {
                    entityName: entityName,
                    entityConfig: entityConfig,
                    entities: entities,
                    currentPage: page,
                    perPage: perPage,
                    totalItems: entityConfig.totalItems()(response)
                };
            });
    };


    /**
     * Get the edition fields of an entity:
     *
     * @param {String} entityName        name of the entity
     * @param {String|Array} filterType  optional filter on the edition type (can be `read-only` or `editable`)
     *
     * @returns {Promise} (list of fields & the entity name, label & id)
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

        var entity = this.config.getEntity(entityName);
        entity.clear();

        return entity;
    };

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {String} entityName
     *
     * @returns {Promise}
     */
    CrudManager.prototype.getReferencedValues = function(entityName) {
        var self = this,
            references = this.getReferences(entityName),
            calls = [];

        angular.forEach(references, function(reference) {
            calls.push(self.getAll(reference.targetEntity().name(), 1, false))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;
                angular.forEach(references, function(reference, index) {
                    references[index].setChoices(self.getReferenceChoices(reference, responses[i++].entities));
                });

                return references;
            });
    };

    /**
     * Returns all ReferencedList for an entity for associated values [{targetEntity.identifier: [targetFields, ...]}}
     *
     * @param {String} entityName
     * @param {Entity} entity
     * @param {String} sortField
     * @param {String} sortDir
     *
     * @returns {Promise}
     */
    CrudManager.prototype.getReferencedListValues = function(entityName, entity, sortField, sortDir) {
        var self = this,
            lists = this.getReferencedLists(entityName),
            entityId = entity.getIdentifier().value,
            calls = [];

        angular.forEach(lists, function(list) {
            calls.push(self.getAll(list.targetEntity().name(), 1, false, false, null, sortField, sortDir))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;
                angular.forEach(lists, function(list, index) {
                    entity.getField(index).setItems(self.filterReferencedList(responses[i++].entities, list, entityId));
                });

                return lists;
            });
    };

    /**
     * Returns only referencedList values for an entity (filter it by identifier value)
     *
     * @param {[Entity]} entities
     * @param {ReferencedList} referencedList
     * @param {String|Number} entityId
     * @returns {Array}
     */
    CrudManager.prototype.filterReferencedList = function(entities, referencedList, entityId) {
        var results = [],
            targetField = referencedList.targetField();

        angular.forEach(entities, function(entity) {
            if (entity.getField(targetField).value == entityId) {
                results.push(entity);
            }
        });

        return results;
    };

    /**
     * Returns all choices for a Reference from values : [{targetIdentifier: targetLabel}]
     *
     * @param {Reference} reference
     * @param {[Entity]} entities
     *
     * @returns {Object}
     */
    CrudManager.prototype.getReferenceChoices = function(reference, entities) {
        var result = {},
            targetEntity = reference.targetEntity(),
            targetIdentifier = targetEntity.getIdentifier().name();

        angular.forEach(entities, function(entity) {
            result[entity.getField(targetIdentifier).value] = entity.getField(reference.targetLabel()).value;
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
     *
     * @returns {Object}
     */
    CrudManager.prototype.getReferencedLists = function(entityName) {
        if (!this.config.hasEntity(entityName)) {
            throw ('Entity ' + entityName + ' not found.');
        }

        return this.config.getEntity(entityName).getReferencedLists();
    };

    /**
     * Fill ReferencedMany & Reference values from a collection a values
     *
     * @param {[Entity]} collection
     * @param {Array} referencedValues
     * @param {Boolean} fillSimpleReference
     * @returns {Array}
     */
    CrudManager.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof(fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        angular.forEach(referencedValues, function(reference, referenceField) {
            var choices = reference.getChoices(),
                value,
                targetField;

            for (var i = 0, l = collection.length; i < l; i++) {
                var entity = collection[i],
                    identifier = reference.valueTransformer()(entity.getField(referenceField).value);

                if (reference.type() === 'reference-many') {
                    entity.getField(referenceField).value = [];

                    angular.forEach(identifier, function(id) {
                        entity.getField(referenceField).value.push(choices[id]);
                    });
                } else if (fillSimpleReference && identifier && identifier in choices) {
                    targetField = reference.targetEntity().getField(reference.targetLabel());
                    value = choices[identifier];
                    entity.getField(referenceField).referencedValue = targetField.getTruncatedListValue(value);
                }
            }
        });

        return collection;
    };

    /**
     * Truncate all values depending of the `truncateList` configuration of a field
     *
     * @param {[Entity]} entities
     */
    CrudManager.prototype.truncateListValue = function(entities) {
        if (!entities.length) {
            return;
        }

        for (var i = 0, l = entities.length; i < l; i++) {
            var entity = entities[i];

            for(var fieldName in entity.getFields()) {
                var field = entity.getField(fieldName);

                if (typeof(field.getTruncatedListValue) === 'function') {
                    entities[i].getField(fieldName).value = field.getTruncatedListValue(entity.getField(fieldName).value);
                }
            }
        }

        return entities;
    };

    CrudManager.$inject = ['$q', 'Restangular', 'NgAdminConfiguration', 'Field'];

    return CrudManager;
});
