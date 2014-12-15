/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        Queries = require('ng-admin/Crud/repository/Queries');

    /**
     * @constructor
     */
    function UpdateQueries() {
        Queries.apply(this, arguments);
    }

    utils.inherits(UpdateQueries, Queries);

    /**
     * Update an entity
     * Put the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise} the updated object
     */
    UpdateQueries.prototype.updateOne = function (view, rawEntity) {
        var identifierField = view.getEntity().identifier(),
            entityId = rawEntity[identifierField.name()],
            routeUrl = this.config.getRouteFor(view, entityId),
            params = this.config.getQueryParamsFor(view),
            headers = view.getHeaders();

        // Get element data
        return this.Restangular
            .oneUrl(view.name(), routeUrl)
            .customPUT(rawEntity, null, params, headers)
            .then(function (response) {
                return view.mapEntry(response.data);
            });
    };

    UpdateQueries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return UpdateQueries;
});
