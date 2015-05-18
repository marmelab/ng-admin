/*global define*/
define(function () {
    'use strict';

    function RestWrapper(Restangular) {
        this.Restangular = Restangular;

        Restangular.setFullResponse(true);
    }

    /**
     * Returns the promise of one resource by URL
     *
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */
    RestWrapper.prototype.getOne = function(entityName, url) {
        return this.Restangular
            .oneUrl(entityName, url)
            .get()
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Returns the promise of a list of resources
     *
     * @param {Object} params
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */
    RestWrapper.prototype.getList = function(params, entityName, url) {
        return this.Restangular
            .allUrl(entityName, url)
            .getList(params);
    };

    RestWrapper.prototype.createOne = function(rawEntity, entityName, url) {
        return this.Restangular
            .oneUrl()
            .customPOST(rawEntity)
            .then(function (response) {
                return response.data;
            });
    };

    RestWrapper.prototype.updateOne = function(rawEntity, entityName, url) {
        return this.Restangular
            .oneUrl(entityName, url)
            .customPUT(rawEntity)
            .then(function (response) {
                return response.data;
            });
    };

    RestWrapper.prototype.deleteOne = function(entityName, url) {
        return this.Restangular
        .oneUrl(entityName, url)
            .customDELETE();
    };

    RestWrapper.$inject = ['Restangular'];

    return RestWrapper;
});
