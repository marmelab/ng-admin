export default class RestWrapper {
    constructor(Restangular) {
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
    getOne(entityName, url) {
        return this.Restangular
            .oneUrl(entityName, url)
            .get()
            .then(function (response) {
                return response.data;
            });
    }

    /**
     * Returns the promise of a list of resources
     *
     * @param {Object} params
     * @param {String} entityName
     * @param {String} url
     *
     * @returns {promise}
     */
    getList(params, entityName, url) {
        return this.Restangular
            .allUrl(entityName, url)
            .getList(params);
    }

    createOne(rawEntity, entityName, url, method) {
        var resource = this.Restangular.oneUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPOST(rawEntity);

        return operation.then(function (response) {
            return response.data;
        });
    }

    updateOne(rawEntity, entityName, url, method) {
        var resource = this.Restangular.oneUrl(entityName, url),
            operation = method ? resource.customOperation(method, null, {}, {}, rawEntity) : resource.customPUT(rawEntity);

        return operation.then(function (response) {
            return response.data;
        });
    }

    deleteOne(entityName, url) {
        return this.Restangular
        .oneUrl(entityName, url)
            .customDELETE();
    }
}

RestWrapper.$inject = ['Restangular'];
