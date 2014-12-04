/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        Repository = require('ng-admin/Crud/repository/Repository');

    /**
     * @constructor
     */
    function CreateRepository() {
        Repository.apply(this, arguments);
    }

    utils.inherits(CreateRepository, Repository);

    /**
     * Create a new entity
     * Post the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise}  the new object
     */
    CreateRepository.prototype.createOne = function (view, rawEntity) {
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

    CreateRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return CreateRepository;
});
