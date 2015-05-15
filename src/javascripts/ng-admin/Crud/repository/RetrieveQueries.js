/*global define*/
define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        angular = require('angular'),
        Queries = require('ng-admin/Crud/repository/Queries');

    /**
     * @constructor
     */
    function RetrieveQueries() {
        Queries.apply(this, arguments);
    }

    utils.inherits(RetrieveQueries, Queries);

    /**
     * Get one entity
     *
     * @param {View}   view      the edit view associated to the entity
     * @param {Number} entityId  id of the entity
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    RetrieveQueries.prototype.getOne = function (entity, viewType, identifierValue, identifierName, url) {
        return this.Restangular
            .oneUrl(entity.name(), this.config.getRouteFor(entity, url, viewType, identifierValue, identifierName))
            .get()
            .then(function (response) {
                return response.data;
            });
    };

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {ListView} view                the view associated to the entity
     * @param {Number}   page                the page number
     * @param {Boolean}  fillSimpleReference should we fill Reference list
     * @param {Object}   filters             searchQuery to filter elements
     * @param {String}   sortField           the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir             the direction of the sort
     *
     * @returns {promise} the entity config & the list of objects
     */
    RetrieveQueries.prototype.getAll = function (view, page, filters, sortField, sortDir) {
        page = page || 1;
        var url = view.getUrl();

        return this.getRawValues(view.getEntity(), view.name(), view.type, page, view.perPage(), filters, view.filters(), sortField || view.getSortFieldName(), sortDir || view.sortDir(), url)
            .then(function (values) {
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
     * @param {ListView} listView     the view associated to the entity
     * @param {Number}   page         the page number
     * @param {Object}   filters      query to retrieve a subset of entries based on field value
     * @param {String}   sortField    the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir      the direction of the sort
     *
     * @returns {promise} the entity config & the list of objects
     */
    RetrieveQueries.prototype.getRawValues = function (entity, viewName, viewType, page, perPage, filterValues, filterFields, sortField, sortDir, url) {
        var params = {};

        if (page !== -1 ) {
            params._page = (typeof (page) === 'undefined') ? 1 : parseInt(page, 10);
            params._perPage = perPage;
        }

        if (sortField && sortField.split('.')[0] === viewName) {
            params._sortField = sortField.split('.')[1];
            params._sortDir = sortDir;
        }

        if (filterValues && Object.keys(filterValues).length !== 0) {
            params._filters = {};
            var filterName;

            for (filterName in filterValues) {

                if (filterFields.hasOwnProperty(filterName) && filterFields[filterName].hasMaps()) {
                    angular.extend(params._filters, filterFields[filterName].getMappedValue(filterValues[filterName]));

                    continue;
                }

                // It's weird to not map, but why not.
                params._filters[filterName] = filterValues[filterName];
            }
        }

        // Get grid data
        return this.Restangular
            .allUrl(entity.name(), this.config.getRouteFor(entity, url, viewType))
            .getList(params);
    };

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {Object}  A hash of Reference and ReferenceMany objects
     * @param {Array} rawValues
     *
     * @returns {promise}
     */
    RetrieveQueries.prototype.getReferencedData = function (references, rawValues) {
        var self = this,
            referencedData = {},
            calls = [],
            singleCallFilters,
            identifiers,
            reference,
            targetEntity,
            data,
            i,
            j,
            k;

        for (i in references) {
            reference = references[i];
            targetEntity = reference.targetEntity();

            if (!rawValues) {
                calls.push(self.getRawValues(targetEntity, targetEntity.name() + '_ListView', 'listView', 1, reference.perPage(), reference.filters(), {}, reference.sortField(), reference.sortDir()));

                continue;
            }

            // get only for identifiers
            identifiers = reference.getIdentifierValues(rawValues);

            // Check if we should retrieve values with 1 or multiple requests
            if (reference.hasSingleApiCall()) {
                singleCallFilters = reference.getSingleApiCall(identifiers);
                calls.push(self.getRawValues(targetEntity, targetEntity.name() + '_ListView', 'listView', 1, reference.perPage(), singleCallFilters, {}, reference.sortField(), reference.sortDir()));

                continue;
            }

            for (k in identifiers) {
                calls.push(self.getOne(targetEntity, 'listView', identifiers[k], reference.name()));
            }
        }

        // Fill all reference entries
        return this.PromisesResolver.allEvenFailed(calls)
            .then(function (responses) {
                if (responses.length === 0) {
                    return {};
                }

                i = 0;
                var response;

                for (j in references) {
                    reference = references[j];
                    singleCallFilters = reference.getSingleApiCall(identifiers);

                    // Retrieve entries depending on 1 or many request was done
                    if (singleCallFilters || !rawValues) {
                        response = responses[i++];
                        if (response.status == 'error') {
                            // the response failed
                            continue;
                        }

                        referencedData[reference.name()] = response.result.data;

                        continue;
                    }

                    data = [];
                    identifiers = reference.getIdentifierValues(rawValues);
                    for (k in identifiers) {
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
    };

    /**
     * Returns all ReferencedList for an entity for associated values [{targetEntity.identifier: [targetFields, ...]}}
     *
     * @param {View}   view
     * @param {String} sortField
     * @param {String} sortDir
     * @param {*} entityId
     *
     * @returns {promise}
     */
    RetrieveQueries.prototype.getReferencedListData = function (referencedLists, sortField, sortDir, entityId) {
        var self = this,
            calls = [],
            referencedList,
            targetEntity,
            viewName,
            filter,
            i,
            j;

        for (i in referencedLists) {
            referencedList = referencedLists[i];
            filter = {};
            filter[referencedList.targetReferenceField()] = entityId;
            targetEntity = referencedList.targetEntity();
            viewName = targetEntity.name() + '_ListView';
            calls.push(self.getRawValues(targetEntity, viewName, 'listView', 1, referencedList.perPage(), filter, {}, sortField || referencedList.getSortFieldName(), sortDir || referencedList.sortDir()));
        }

        return this.$q.all(calls)
            .then(function (responses) {
                j = 0;

                var entries = {};
                for (i in referencedLists) {

                    entries[i] = responses[j++].data;
                }

                return entries;
            });
    };

    RetrieveQueries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration', 'PromisesResolver'];

    return RetrieveQueries;
});
