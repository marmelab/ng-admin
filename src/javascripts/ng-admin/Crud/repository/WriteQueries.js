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
    function WriteQueries(RestWrapper, Configuration, AdminDescription, PromisesResolver) {
        return AdminDescription.getReadQueries(RestWrapper, PromisesResolver, Configuration())
    }

    WriteQueries.$inject = ['RestWrapper', 'NgAdminConfiguration', 'AdminDescription', 'PromisesResolver'];

    return WriteQueries;
});
