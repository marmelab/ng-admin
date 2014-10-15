define(function(require) {
    'use strict';

    var angular = require('angular'),
        utils = require('ng-admin/lib/utils'),
        ViewRepository = require('ng-admin/Crud/component/service/ViewRepository');

    /**
     * @constructor
     */
    function FormViewRepository() {
        ViewRepository.apply(this, arguments);
    }

    utils.inherits(FormViewRepository, ViewRepository);

    /**
     * Get one entity
     *
     * @param {View}   view      the list view associated to the entity
     * @param {Number} entityId  id of the entity
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    FormViewRepository.prototype.getOne = function(view, entityId) {
        var entityConfig = view.getEntity(),
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
    FormViewRepository.prototype.createOne = function (entityName, entity) {
        if (!this.config.hasEntity(entityName)) {
            return this.$q.reject('Entity ' + entityName + ' not found.');
        }

        var headers = this.config.getHeaders(entityName, 'createOne');

        // Get element data
        return this.Restangular
            .restangularizeElement(null, entity, entityName)
            .post(null, entity, null, headers);
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
    FormViewRepository.prototype.updateOne = function(entityName, entity) {
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
    FormViewRepository.prototype.deleteOne = function(entityName, entityId) {
        var headers = this.config.getHeaders(entityName, 'deleteOne');

        return this.Restangular
            .one(entityName, entityId)
            .remove(null, headers);
    };
});
