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
    RestWrapper.prototype.getOne = function(entityName, url, method) {
        var resource = this.Restangular.oneUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, null) : resource.customGET();

        return operation.then(function (response) {
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
    RestWrapper.prototype.getList = function(params, entityName, url, method) {
        var resource = this.Restangular.allUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, params) : resource.customGET(params);

        return operation;
    };

    RestWrapper.prototype.createOne = function(rawEntity, entityName, url, method) {
        var resource = this.Restangular.oneUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPOST(rawEntity);

        return operation.then(function (response) {
            return response.data;
        });
    };

    RestWrapper.prototype.updateOne = function(rawEntity, entityName, url, method) {
        var resource = this.Restangular.oneUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPUT(rawEntity);

        return operation.then(function (response) {
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
