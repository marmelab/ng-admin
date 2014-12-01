/*global define*/

define(function (require) {
    'use strict';

    var utils = require('ng-admin/lib/utils'),
        ViewRepository = require('ng-admin/Crud/component/service/ViewRepository');

    /**
     * @constructor
     */
    function ListViewRepository() {
        ViewRepository.apply(this, arguments);
    }

    utils.inherits(ListViewRepository, ViewRepository);

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {ListView} view                the view associated to the entity
     * @param {Number}   page                the page number
     * @param {Boolean}  fillSimpleReference should we fill Reference list
     * @param {String}   query               searchQuery to filter elements
     * @param {String}   sortField           the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir             the direction of the sort
     * @param {Object}   filters             filter specific fields
     *
     * @returns {promise} the entity config & the list of objects
     */
    ListViewRepository.prototype.getAll = function (view, page, fillSimpleReference, query, sortField, sortDir, filters) {
        var rawEntries,
            entries,
            referencedValues,
            self = this;

        page = page || 1;
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? true : fillSimpleReference;

        return this.getRawValues(view, page, query, sortField, sortDir, filters)
            .then(function (values) {
                rawEntries = values;

                return self.getReferencedValues(view);
            }).then(function (refValues) {
                referencedValues = refValues;

                entries = view.mapEntries(rawEntries.data);

                entries = self.fillReferencesValuesFromCollection(entries, referencedValues, fillSimpleReference);
                entries = view.getMappedValue(entries);

                return {
                    view: view,
                    entries: entries,
                    currentPage: page,
                    perPage: view.perPage(),
                    totalItems: view.totalItems()(rawEntries)
                };
            });
    };

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {ListView} listView  the view associated to the entity
     * @param {Number}   page      the page number
     * @param {String}   query     searchQuery to filter elements
     * @param {String}   sortField the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir   the direction of the sort
     * @param {Object}   filters   filter specific fields
     *
     * @returns {promise} the entity config & the list of objects
     */
    ListViewRepository.prototype.getRawValues = function (listView, page, query, sortField, sortDir, filters) {
        page = (typeof (page) === 'undefined') ? 1 : parseInt(page, 10);
        filters = (typeof (filters) === 'undefined') ? {} : filters;

        var interceptor = listView.interceptor(),
            sortView = sortField ? sortField.split('.')[0] : '',
            sortParams = sortView === listView.name() ? listView.getSortParams(sortField.split('.').pop(), sortDir) : null,
            params = listView.getAllParams(page, sortParams, query),
            headers = listView.getAllHeaders(sortParams),
            fieldName;

        filters = listView.filterParams()(filters);

        // Add filters
        for (fieldName in filters) {
            params[fieldName] = filters[fieldName];
        }

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get grid data
        return this.Restangular
            .all(listView.getEntity().name())
            .getList(params, headers);
    };

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {View} view
     *
     * @returns {promise}
     */
    ListViewRepository.prototype.getReferencedValues = function (view) {
        var self = this,
            references = view.getReferences(),
            calls = [],
            reference,
            i,
            j;

        for (i in references) {
            reference = references[i];
            var view = reference.getReferencedView();
            calls.push(self.getRawValues(view, 1, false, reference.getSortFieldName(), 'ASC'));
        }

        return this.$q.all(calls)
            .then(function (responses) {
                i = 0;

                for (j in references) {
                    references[j].setEntries(responses[i++].data);
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
    ListViewRepository.prototype.getReferencedListValues = function (view, sortField, sortDir, entityId) {
        var self = this,
            referenceLists = view.getReferencedLists(),
            calls = [],
            referenceList,
            referencedView,
            i;

        for (i in referenceLists) {
            referenceList = referenceLists[i];

            calls.push(self.getRawValues(referenceList.getReferencedView(), 1, null, sortField, sortDir));
        }

        return this.$q.all(calls)
            .then(function (responses) {
                var j = 0;

                for (i in referenceLists) {
                    referenceList = referenceLists[i];
                    referencedView = referenceList.getReferencedView();


                    referenceList
                        .setEntries(responses[j++].data)
                        // Map entries
                        .setEntries(referencedView.mapEntries(referenceList.getEntries()))
                        .filterEntries(entityId);
                }

                return referenceLists;
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
    ListViewRepository.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues, fillSimpleReference) {
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
    ListViewRepository.prototype.fillReferencesValuesFromEntry = function (entry, referencedValues, fillSimpleReference) {
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
            identifier = reference.getMappedValue(entry.values[referenceField]);

            if (reference.type() === 'ReferenceMany') {
                for (i in identifier) {
                    id = identifier[i];
                    entries.push(choices[id]);
                }

                entry.listValues[referenceField] = entries;
            } else if (fillSimpleReference && identifier && identifier in choices) {
                entry.listValues[referenceField] = reference.getMappedValue(choices[identifier]);
            }
        }

        return entry;
    };

    ListViewRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return ListViewRepository;
});
