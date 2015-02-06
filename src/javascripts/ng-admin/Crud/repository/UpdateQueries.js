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
        var entityId = rawEntity[view.getEntity().identifier().name()],
            method = view.getEntity().updateMethod(),
            url = this.Restangular.oneUrl(view.entity.name(), this.config.getRouteFor(view, entityId)),
            operation;
        if(method === 'patch') {
            var viewFields = _.keys(view.fields());
            operation = url.customOperation(method, null, {}, {}, _.pick(rawEntity, viewFields));
        } else {
            operation = url.customPUT(rawEntity);
        }
        return operation.then(function (response) {
            return view.mapEntry(response.data);
        });
    };

    UpdateQueries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return UpdateQueries;
});
