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
    RetrieveQueries.prototype.getOne = function (view, entityId) {
        return this.Restangular
            .oneUrl(view.entity.name(), this.config.getRouteFor(view, entityId))
            .get()
            .then(function (response) {
                return view.mapEntry(response.data);
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
    RetrieveQueries.prototype.getAll = function (view, page, fillSimpleReference, filters, sortField, sortDir) {
        var response,
            entries,
            referencedValues,
            self = this;

        page = page || 1;
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? true : fillSimpleReference;

        return this.getRawValues(view, page, filters, sortField, sortDir)
            .then(function (values) {
                response = values;

                return self.getReferencedValues(view.getReferences(), response.data);
            }).then(function (refValues) {
                referencedValues = refValues;

                entries = view.mapEntries(response.data);
                entries = self.fillReferencesValuesFromCollection(entries, referencedValues, fillSimpleReference);

                return {
                    entries: entries,
                    currentPage: page,
                    perPage: view.perPage(),
                    totalItems: response.totalCount || response.headers('X-Total-Count') || response.data.length
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
    RetrieveQueries.prototype.getRawValues = function (listView, page, filters, sortField, sortDir) {
        var params = {
            _page: (typeof (page) === 'undefined') ? 1 : parseInt(page, 10),
            _perPage: listView.perPage()
        };

        if (sortField && sortField.split('.')[0] === listView.name()) {
            params._sortField = sortField.split('.')[1];
            params._sortDir = sortDir;
        } else if (listView.sortField()) {
            params._sortField = listView.sortField();
            params._sortDir = listView.sortDir();
        }

        if (filters && Object.keys(filters).length !== 0) {
            var filterFields = listView.filters(),
                filterName;
            params._filters = {};
            for (filterName in filters) {
                if (filterFields.hasOwnProperty(filterName) && filterFields[filterName].hasMaps()) {
                    angular.extend(params._filters, filterFields[filterName].getMappedValue(filters[filterName]));
                } else {
                    params._filters[filterName] = filters[filterName];
                }
            }
        }

        // Get grid data
        return this.Restangular
            .allUrl(listView.entity.name(), this.config.getRouteFor(listView))
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
    RetrieveQueries.prototype.getReferencedValues = function (references, rawValues) {
        var self = this,
            calls = [],
            singleCallFilters,
            identifiers,
            reference,
            referencedView,
            entries,
            i,
            j,
            k;

        for (i in references) {
            reference = references[i];
            referencedView = reference.getReferencedView();

            if (!rawValues) {
                calls.push(self.getRawValues(referencedView, 1, reference.filters(), reference.sortField(), reference.sortDir()));
            } else {
                identifiers = reference.getIdentifierValues(rawValues);
                // Check if we should retrieve values with 1 or multiple requests
                if (reference.hasSingleApiCall()) {
                    singleCallFilters = reference.getSingleApiCall(identifiers);
                    calls.push(self.getRawValues(referencedView, 1, singleCallFilters, reference.sortField(), reference.sortDir()));
                } else {
                    for (k in identifiers) {
                        calls.push(self.getOne(referencedView, identifiers[k]));
                    }
                }
            }
        }

        // Fill all reference entries
        return this.$q.all(calls)
            .then(function (responses) {
                i = 0;

                for (j in references) {
                    reference = references[j];
                    singleCallFilters = reference.getSingleApiCall(identifiers);

                    // Retrieve entries depending on 1 or many request was done
                    if (singleCallFilters || !rawValues) {
                        references[j].entries = reference.getReferencedView().mapEntries(responses[i++].data);
                    } else {
                        entries = [];
                        identifiers = reference.getIdentifierValues(rawValues);
                        for (k in identifiers) {
                            entries.push(responses[i++]);
                        }

                        // Entry are already mapped by getOne
                        references[j].entries = entries;
                    }
                }

                return references;
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
    RetrieveQueries.prototype.getReferencedListValues = function (view, sortField, sortDir, entityId) {
        var self = this,
            referencedLists = view.getReferencedLists(),
            calls = [],
            referencedList,
            filter,
            i,
            j;

        for (i in referencedLists) {
            referencedList = referencedLists[i];
            filter = {};
            filter[referencedList.targetReferenceField()] = entityId;

            calls.push(self.getRawValues(referencedList.getReferencedView(), 1, filter, sortField || referencedList.sortField(), sortDir || referencedList.sortDir()));
        }

        return this.$q.all(calls)
            .then(function (responses) {
                j = 0;

                for (i in referencedLists) {
                    referencedList = referencedLists[i];

                    // Map entries
                    referencedList.entries = referencedList.getReferencedView().mapEntries(responses[j++].data);
                }

                return referencedLists;
            });
    };

    /**
     * Fill ReferencedMany & Reference values from a collection a values
     *
     * @param {[Entry]}  collection
     * @param {Object}  referencedValues
     * @param {Boolean} fillSimpleReference
     * @returns {Array}
     */
    RetrieveQueries.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        var i, l;

        for (i = 0, l = collection.length; i < l; i++) {
            collection[i] = this.fillReferencesValuesFromEntry(collection[i], referencedValues, fillSimpleReference);
        }

        return collection;
    };

    /**
     * Fill ReferencedMany & Reference values from a collection a values
     *
     * @param {Entry}  entry
     * @param {Object}  referencedValues
     * @param {Boolean} fillSimpleReference
     * @returns {Array}
     */
    RetrieveQueries.prototype.fillReferencesValuesFromEntry = function (entry, referencedValues, fillSimpleReference) {
        var reference,
            referenceField,
            choices,
            entries,
            identifier,
            id,
            i;

        for (referenceField in referencedValues) {
            reference = referencedValues[referenceField];
            choices = reference.getChoicesById();
            entries = [];
            identifier = reference.getMappedValue(entry.values[referenceField], entry.values);

            if (reference.type() === 'reference_many') {
                for (i in identifier) {
                    id = identifier[i];
                    entries.push(choices[id]);
                }

                entry.listValues[referenceField] = entries;
            } else if (fillSimpleReference && identifier && identifier in choices) {
                entry.listValues[referenceField] = reference.getMappedValue(choices[identifier], entry.values);
            }
        }

        return entry;
    };

    RetrieveQueries.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return RetrieveQueries;
});
