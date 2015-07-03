var WriteQueries = require('admin-config/lib/Queries/WriteQueries');

/**
 *
 * @param {RestWrapper} RestWrapper
 * @param {PromisesResolver} PromisesResolver
 * @param {Configuration} configuration
 *
 * @returns {WriteQueries}
 * @constructor
 */
function WriteQueriesService(RestWrapper, PromisesResolver, configuration) {
    return new WriteQueries(RestWrapper, PromisesResolver, configuration);
}

WriteQueriesService.$inject = ['RestWrapper', 'PromisesResolver', 'NgAdminConfiguration'];

module.exports = WriteQueriesService;
