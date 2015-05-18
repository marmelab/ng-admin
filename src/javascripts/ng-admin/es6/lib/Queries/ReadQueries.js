import Queries from './Queries'

class ReadQueries extends Queries {

    /**
     * Get one entity
     *
     * @param {Entity}   entity
     * @param {String}   viewType
     * @param {mixed}    identifierValue
     * @param {String}   identifierName
     * @param {String}   url
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    getOne(entity, viewType, identifierValue, identifierName, url) {
        return this._restWrapper
            .getOne(entity.name(), this._application.getRouteFor(entity, url, viewType, identifierValue, identifierName));
    }

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {ListView} view                the view associated to the entity
     * @param {Number}   page                the page number
     * @param {Object}   filters             searchQuery to filter elements
     * @param {String}   sortField           the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir             the direction of the sort
     *
     * @returns {promise} the entity config & the list of objects
     */
    getAll(view, page, filters, sortField, sortDir) {
        page = page || 1;
        let url = view.getUrl();

        sortField = sortField || view.getSortFieldName();
        sortDir = sortDir || view.sortDir();

        return this.getRawValues(view.entity, view.name(), view.type, page, view.perPage(), filters, view.filters(), sortField, sortDir, url)
            .then((values) => {
                return {
                    data: values.data,
                    totalItems: values.totalCount || values.headers('X-Total-Count') || values.data.length
                };
            });
    };

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {Entity}   entity
     * @param {String}   viewName
     * @param {String}   viewType
     * @param {Number}   page
     * @param {Number}   perPage
     * @param {Object}   filterValues
     * @param {Object}   filterFields
     * @param {String}   sortField
     * @param {String}   sortDir
     * @param {String}   url
     *
     * @returns {promise} the entity config & the list of objects
     */
    getRawValues(entity, viewName, viewType, page, perPage, filterValues, filterFields, sortField, sortDir, url) {
        let params = {};

        // Compute pagination
        if (page !== -1) {
            params._page = (typeof (page) === 'undefined') ? 1 : parseInt(page, 10);
            params._perPage = perPage;
        }

        // Compute sorting
        if (sortField && sortField.split('.')[0] === viewName) {
            params._sortField = sortField.split('.')[1];
            params._sortDir = sortDir;
        }

        // Compute filtering
        if (filterValues && Object.keys(filterValues).length !== 0) {
            params._filters = {};
            let filterName;

            for (filterName in filterValues) {
                if (filterFields.hasOwnProperty(filterName) && filterFields[filterName].hasMaps()) {
                    Object.assign(params._filters, filterFields[filterName].getMappedValue(filterValues[filterName]));

                    continue;
                }

                // It's weird to not map, but why not.
                params._filters[filterName] = filterValues[filterName];
            }
        }

        // Get grid data
        return this._restWrapper
            .getList(params, entity.name(), this._application.getRouteFor(entity, url, viewType));
    };

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * by calling the API for each entries
     *
     * @param {[ReferenceField]} references A hash of Reference and ReferenceMany objects
     * @param {Array} rawValues
     *
     * @returns {Promise}
     */
    getFilteredReferenceData(references, rawValues) {
        if (!references.length) {
            return this._promisesResolver.empty();
        }

        let getOne = this.getOne.bind(this),
            calls = [];

        for (let i in references) {
            let reference = references[i],
                targetEntity = reference.targetEntity(),
                identifiers = reference.getIdentifierValues(rawValues);

            for (let k in identifiers) {
                calls.push(getOne(targetEntity, 'listView', identifiers[k], reference.name()));
            }
        }

        return fillFilteredReferencedData(calls, references, rawValues);
    };

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * by calling the API once
     *
     * @param {[ReferenceField]} references A hash of Reference and ReferenceMany objects
     * @param {Array} rawValues
     *
     * @returns {Promise}
     */
    getOptimizedReferencedData(references, rawValues) {
        if (!references.length) {
            return this._promisesResolver.empty();
        }

        let getRawValues = this.getRawValues.bind(this),
            calls = [];

        for (let i in references) {
            let reference = references[i],
                targetEntity = reference.targetEntity(),
                identifiers = reference.getIdentifierValues(rawValues);

            // Check if we should retrieve values with 1 or multiple requests
            let singleCallFilters = reference.getSingleApiCall(identifiers);
            calls.push(getRawValues(targetEntity, targetEntity.name() + '_ListView', 'listView', 1, reference.perPage(), singleCallFilters, {}, reference.sortField(), reference.sortDir()));
        }

        return fillOptimizedReferencedData(calls, references);
    }

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * without filters on an entity
     *
     * @param {[ReferenceField]} references A hash of Reference and ReferenceMany objects
     *
     * @returns {Promise}
     */
    getAllReferencedData(references) {
        if (!references.length) {
            return this._promisesResolver.empty();
        }

        let calls = [];

        for (let i in references) {
            let reference = references[i],
                targetEntity = reference.targetEntity();

            calls.push(getRawValues(targetEntity, targetEntity.name() + '_ListView', 'listView', 1, reference.perPage(), reference.filters(), {}, reference.sortField(), reference.sortDir()));
        }

        return fillOptimizedReferencedData(calls, references);
    }

    /**
     * Fill all reference entries to return [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {[Promise]} apiCalls
     * @param {[Reference]} references
     * @returns {Promise}
     */
    fillOptimizedReferencedData(apiCalls, references) {
        return this._promisesResolver.allEvenFailed(apiCalls)
            .then((responses) => {
                if (responses.length === 0) {
                    return {};
                }

                let referencedData = {},
                    i = 0;

                for (let j in references) {
                    let reference = references[j],
                        response = responses[i++];

                    // Retrieve entries depending on 1 or many request was done
                    if (response.status == 'error') {
                        // the response failed
                        continue;
                    }

                    referencedData[reference.name()] = response.result.data;
                }

                return referencedData;
            });
    }

    /**
     * Fill all reference entries to return [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {[Promise]} apiCalls
     * @param {[Reference]} references
     * @param {[Object]} rawValues
     * @returns {Promise}
     */
    fillFilteredReferencedData(apiCalls, references, rawValues) {
        return this._promisesResolver.allEvenFailed(apiCalls)
            .then((responses) => {
                if (responses.length === 0) {
                    return {};
                }

                let referencedData = {},
                    response,
                    i = 0;

                for (let j in references) {
                    let data = [],
                        reference = references[j],
                        identifiers = reference.getIdentifierValues(rawValues);

                    for (let k in identifiers) {
                        response = responses[i++];
                        if (response.status == 'error') {
                            // one of the responses failed
                            continue;
                        }
                        data.push(response.result);
                    }

                    if (!data.length) {
                        continue;
                    }

                    referencedData[reference.name()] = data;
                }

                return referencedData;
            });
    }

    /**
     * Returns all ReferencedList for an entity for associated values [{targetEntity.identifier: [targetFields, ...]}}
     *
     * @param {View}   referencedLists
     * @param {String} sortField
     * @param {String} sortDir
     * @param {*} entityId
     *
     * @returns {promise}
     */
    getReferencedListData(referencedLists, sortField, sortDir, entityId) {
        let getRawValues = this.getRawValues.bind(this),
            calls = [];

        for (let i in referencedLists) {
            let referencedList = referencedLists[i],
                targetEntity = referencedList.targetEntity(),
                viewName = targetEntity.name() + '_ListView',
                filter = {};

            filter[referencedList.targetReferenceField()] = entityId;
            calls.push(getRawValues(targetEntity, viewName, 'listView', 1, referencedList.perPage(), filter, {}, sortField || referencedList.getSortFieldName(), sortDir || referencedList.sortDir()));
        }

        return this._promisesResolver.allEvenFailed(calls)
            .then((responses) => {
                let j = 0,
                    entries = {};

                for (let i in referencedLists) {
                    let response = responses[j++];
                    if (response.status == 'error') {
                        // If a response fail, skip it
                        continue;
                    }

                    entries[i] = response.result.data;
                }

                return entries;
            });
    };
}

export default ReadQueries
