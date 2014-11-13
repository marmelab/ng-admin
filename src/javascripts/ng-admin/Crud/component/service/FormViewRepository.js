/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
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
    FormViewRepository.prototype.getOne = function (view, entityId) {
        var interceptor = view.interceptor(),
            params = view.getExtraParams(),
            headers = view.getHeaders();

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get element data
        return this.Restangular
            .one(view.getEntity().name(), entityId)
            .get(params, headers)
            .then(function (response) {
                return view.mapEntry(response.data);
            });
    };

    /**
     * Create a new entity
     * Post the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise}  the new object
     */
    FormViewRepository.prototype.createOne = function (view, rawEntity) {
        var entityName = view.getEntity().name(),
            headers = view.getHeaders();

        // Get element data
        return this.Restangular
            .restangularizeElement(null, rawEntity, entityName)
            .post(null, rawEntity, null, headers)
            .then(function (response) {
                return view.mapEntry(response.data);
            });
    };

    /**
     * Update an entity
     * Put the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise} the updated object
     */
    FormViewRepository.prototype.updateOne = function (view, rawEntity) {
        var entityName = view.getEntity().name(),
            headers = view.getHeaders();

        // Get element data
        return this.Restangular
            .restangularizeElement(null, rawEntity, entityName)
            .put(null, headers)
            .then(function (response) {
                return view.mapEntry(response.data);
            });
    };


    /**
     * Delete an entity
     * Delete the data to the API
     *
     * @param {String} view     the formView related to the entity
     * @param {*}      entityId the entity's id
     *
     * @returns {promise}
     */
    FormViewRepository.prototype.deleteOne = function (view, entityId) {
        var entityName = view.getEntity().name(),
            headers = view.getHeaders();

        return this.Restangular
            .one(entityName, entityId)
            .remove(null, headers);
    };

    FormViewRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return FormViewRepository;
});
