define([
    'app',
    'config'
], function(app, config) {
    'use strict';

    function CrudManager($q, Restangular) {
        this.$q = $q;
        this.Restangular = Restangular;
    }

    /**
     * Get one entity
     *
     * @param {String} entityName  name of the entity
     * @param {Number} entityId       id of the entity
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    CrudManager.prototype.getOne = function(entityName, entityId) {
        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var entityConfig = config.getEntity(entityName);
        this.Restangular.setBaseUrl(config.baseApiUrl());
        this.Restangular.setFullResponse(true);  // To get also the headers

        // Get element data
        return this.Restangular
            .one(entityName, entityId)
            .get()
            .then(function(response) {

                var fields = entityConfig.getFields(),
                    entity = response.data;

                angular.forEach(fields, function(field, index) {
                    if (!(field.getName() in entity)) {
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

        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var entityConfig = config.getEntity(entityName),
            fields = this.filterEditionFields(entityConfig.getFields(), filters);

        return {
            fields: fields,
            entityLabel: entityConfig.label(),
            entityName: entityName
        };
    };

    CrudManager.prototype.getReferences = function(entityName) {
        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        return config.getEntity(entityName).getReferences();
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
        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        this.Restangular.setBaseUrl(config.baseApiUrl());
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
        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        this.Restangular.setBaseUrl(config.baseApiUrl());

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
        this.Restangular.setBaseUrl(config.baseApiUrl());

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

        if (!config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var entityConfig = config.getEntity(entityName),
            pagination = entityConfig.pagination(),
            perPage = entityConfig.perPage();

        this.Restangular.setBaseUrl(config.baseApiUrl());
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
