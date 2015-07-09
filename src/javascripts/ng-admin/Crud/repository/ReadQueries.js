var ReadQueries = require('admin-config/lib/Queries/ReadQueries');

/**
 *
 * @param {RestWrapper} RestWrapper
 * @param {PromisesResolver} PromisesResolver
 * @param {Configuration} configuration
 *
 * @returns {ReadQueries}
 * @constructor
 */
function ReadQueriesService(RestWrapper, PromisesResolver, configuration) {
    return new ReadQueries(RestWrapper, PromisesResolver, configuration);
}

ReadQueriesService.$inject = ['RestWrapper', 'PromisesResolver', 'NgAdminConfiguration'];

module.exports = ReadQueriesService;
