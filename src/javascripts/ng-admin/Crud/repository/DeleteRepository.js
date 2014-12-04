/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        Repository = require('ng-admin/Crud/repository/Repository');

    /**
     * @constructor
     */
    function DeleteRepository() {
        Repository.apply(this, arguments);
    }

    utils.inherits(DeleteRepository, Repository);

    /**
     * Delete an entity
     * Delete the data to the API
     *
     * @param {String} view     the formView related to the entity
     * @param {*}      entityId the entity's id
     *
     * @returns {promise}
     */
    DeleteRepository.prototype.deleteOne = function (view, entityId) {
        var entityName = view.getEntity().name(),
            headers = view.getHeaders();

        return this.Restangular
            .one(entityName, entityId)
            .remove(null, headers);
    };

    DeleteRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return DeleteRepository;
});
