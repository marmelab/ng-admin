/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        Repository = require('ng-admin/Crud/repository/Repository');

    /**
     * @constructor
     */
    function RetrieveRepository() {
        Repository.apply(this, arguments);
    }

    utils.inherits(RetrieveRepository, Repository);

    /**
     * Get one entity
     *
     * @param {View}   view      the edit view associated to the entity
     * @param {Number} entityId  id of the entity
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    RetrieveRepository.prototype.getOne = function (view, entityId) {
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

    RetrieveRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return RetrieveRepository;
});
