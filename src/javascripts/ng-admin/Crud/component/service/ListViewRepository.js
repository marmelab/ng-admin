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
                entries = view.truncateListValue(entries);

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
     * @param {View}   view      the view associated to the entity
     * @param {Number} page      the page number
     * @param {String} query     searchQuery to filter elements
     * @param {String} sortField the field to be sorted ex: entity.fieldName
     * @param {String} sortDir   the direction of the sort
     * @param {Object} filters   filter specific fields
     *
     * @returns {promise} the entity config & the list of objects
     */
    ListViewRepository.prototype.getRawValues = function (view, page, query, sortField, sortDir, filters) {
        page = (typeof (page) === 'undefined') ? 1 : parseInt(page, 10);
        filters = (typeof (filters) === 'undefined') ? {} : filters;

        var entityConfig = view.getEntity(),
            interceptor = view.interceptor(),
            sortView = sortField ? sortField.split('.')[0] : '',
            sortParams = sortView === view.name() ? entityConfig.getSortParams(sortField.split('.').pop(), sortDir) : null,
            params = view.getAllParams(page, sortParams, query),
            headers = view.getAllHeaders(sortParams),
            fieldName;

        filters = entityConfig.filterParams()(filters);

        // Add filters
        for (fieldName in filters) {
            params[fieldName] = filters[fieldName];
        }

        if (interceptor) {
            this.Restangular.addResponseInterceptor(interceptor);
        }

        // Get grid data
        return this.Restangular
            .all(entityConfig.name())
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

            calls.push(self.getRawValues(reference.getReferencedView(), 1, false));
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
     *
     * @returns {promise}
     */
    ListViewRepository.prototype.getReferencedListValues = function (view, sortField, sortDir) {
        var self = this,
            referenceLists = view.getReferencedLists(),
            entityId = view.identifier().value(),
            calls = [],
            referenceList,
            i;

        for (i in referenceLists) {
            referenceList = referenceLists[i];

            calls.push(self.getRawValues(referenceList.getReferencedView(), 1, false, false, null, sortField, sortDir));
        }

        return this.$q.all(calls)
            .then(function (responses) {
                var j = 0;

                for (i in referenceLists) {
                    referenceLists[i]
                        .setEntries(responses[j++].data)
                        .filterEntries(entityId);
                }

                return referenceLists;
            });
    };

    /**
     * Fill ReferencedMany & Reference values from a collection a values
     *
     * @param {[View]}  collection
     * @param {Object}  referencedValues
     * @param {Boolean} fillSimpleReference
     * @returns {Array}
     */
    ListViewRepository.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        var choices,
            entry,
            entries = [],
            reference,
            referenceField,
            i,
            j,
            l,
            id,
            identifier;

        for (referenceField in referencedValues) {
            reference = referencedValues[referenceField];
            choices = reference.getChoices();

            for (i = 0, l = collection.length; i < l; i++) {
                entry = collection[i];
                entries = [];
                identifier = reference.valueTransformer()(entry.getField(referenceField).value());

                if (reference.constructor.name === 'ReferenceMany') {
                    for (j in identifier) {
                        id = identifier[j];
                        entries.push(choices[id]);
                    }

                    entry.getField(referenceField).value(entries);
                } else if (fillSimpleReference && identifier && identifier in choices) {
                    entry.getField(referenceField).referencedValue = reference.getTruncatedListValue(choices[identifier]);
                }
            }
        }

        return collection;
    };

    ListViewRepository.$inject = ['$q', 'Restangular', 'NgAdminConfiguration'];

    return ListViewRepository;
});
