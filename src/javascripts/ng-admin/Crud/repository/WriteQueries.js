/**
 * @param {RestWrapper} RestWrapper
 * @param {Configuration} Configuration
 * @param {AdminDescription} AdminDescription
 * @param {PromisesResolver} PromisesResolver
 *
 * @returns {ReadQueries}
 * @constructor
 */
export default function WriteQueries(RestWrapper, Configuration, AdminDescription, PromisesResolver) {
    return AdminDescription.getWriteQueries(RestWrapper, PromisesResolver, Configuration())
}

WriteQueries.$inject = ['RestWrapper', 'NgAdminConfiguration', 'AdminDescription', 'PromisesResolver'];
