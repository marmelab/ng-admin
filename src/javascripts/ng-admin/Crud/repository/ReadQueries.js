/*global define*/
define(function () {
    'use strict';

    /**
     *
     * @param {RestWrapper} RestWrapper
     * @param {Configuration} Configuration
     * @param {AdminDescription} AdminDescription
     * @param {PromisesResolver} PromisesResolver
     *
     * @returns {ReadQueries}
     * @constructor
     */
    function ReadQueries(RestWrapper, Configuration, AdminDescription, PromisesResolver) {
        return AdminDescription.getReadQueries(RestWrapper, PromisesResolver, Configuration())
    }

    ReadQueries.$inject = ['RestWrapper', 'NgAdminConfiguration', 'AdminDescription', 'PromisesResolver'];

    return ReadQueries;
});
