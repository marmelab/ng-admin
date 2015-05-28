/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        Queries = require('ng-admin/Crud/repository/Queries');

    /**
     * @constructor
     */
    function CreateQueries() {
        Queries.apply(this, arguments);
    }

    utils.inherits(CreateQueries, Queries);

    /**
     * Create a new entity
     * Post the data to the API to create the new object
     *
     * @param {View}   view      the formView related to the entity
     * @param {Object} rawEntity the entity's object
     *
     * @returns {promise}  the new object
     */
    CreateQueries.prototype.createOne = function (view, rawEntity) {

        var method = view.entity.createMethod(),
            resource = this.Restangular.oneUrl(view.entity.name(), this.config.getRouteFor(view.entity, view.getUrl(), view.type)),
            operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPOST(rawEntity);

        return operation.then(function (response) {
            return response.data;
        });
    };

    CreateQueries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration', 'PromisesResolver'];

    return CreateQueries;
});
