define([
    'angular',
    'config'
], function(angular, ApplicationConfig) {
    'use strict';

    function CrudManager($q, Restangular, config) {
        this.$q = $q;
        this.Restangular = Restangular;
        this.config = config || ApplicationConfig;
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

        var entityConfig = this.config.getEntity(entityName);
        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers

        // Get element data
        return this.Restangular
            .one(entityName, entityId)
            .get()
            .then(function(response) {

                var fields = entityConfig.getFields(),
                    entity = response.data;

                angular.forEach(fields, function(field, index) {
                    if (field.getName() in entity) {
                        fields[index].value = entity[field.getName()];
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

        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(false);

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

        this.Restangular.setBaseUrl(this.config.baseApiUrl());

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
        this.Restangular.setBaseUrl(this.config.baseApiUrl());

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
    CrudManager.prototype.getAll = function (entityName, page) {
        page = (typeof(page) === 'undefined') ? 1 : parseInt(page);

        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var entityConfig = this.config.getEntity(entityName),
            pagination = entityConfig.pagination(),
            perPage = entityConfig.perPage();

        this.Restangular.setBaseUrl(this.config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers

        // Get grid data
        return this.Restangular
            .all(entityName)
            .getList(pagination ? { page: page, per_page: perPage} : null)
            .then(function (response) {
                return {
                    entityName: entityName,
                    entityConfig: entityConfig,
                    rawItems: response.data,
                    currentPage: page,
                    perPage: perPage,
                    totalItems: response.headers('X-Count')
                };
            });
    };

    CrudManager.$inject = ['$q', 'Restangular'];

    return CrudManager;
});
