define(function(require) {
    'use strict';

    var angular = require('angular'),
        utils = require('ng-admin/lib/utils'),
        ViewRepository = require('ng-admin/Crud/component/service/ViewRepository');

    /**
     * @constructor
     */
    function ListViewRepository() {
        ViewRepository.apply(this, arguments);
    }

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {View}    view                the view associated to the entity
     * @param {Number}  page                the page number
     * @param {Boolean} fillSimpleReference should we fill Reference list
     * @param {String}  query               searchQuery to filter elements
     * @param {String}  sortField           the field to be sorted ex: entity.fieldName
     * @param {String}  sortDir             the direction of the sort
     * @param {Object}  filters             filter specific fields
     *
     * @returns {promise} the entity config & the list of objects
     */
    ListViewRepository.prototype.getAll = function (view, page, fillSimpleReference, query, sortField, sortDir, filters) {
        var rawValues,
            entity = view.getEntity(),
            entityName = entity.name(),
            referencedValues,
            self = this;

        this.getRawValues(view, page, query, sortField, sortDir, filters)
            .then(function(values) {
                rawValues = values;

                return self.getReferencedValues(entityName);
            }).then(function(values) {
                referencedValues = values;

                return self.mapEntities(view, rawValues);
            }).then(function(entities) {
                entities = self.fillReferencesValuesFromCollection(entities, referencedValues, fillSimpleReference);
                entities = self.truncateListValue(entities);

                return {
                    view: view,
                    entities: entities,
                    currentPage: page,
                    perPage: view.perPage(),
                    totalItems: entity.totalItems()(response) // @TODO: use a method in the listView
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
        var entityName = view.getEntity().name();

        page = (typeof(page) === 'undefined') ? 1 : parseInt(page);
        filters = (typeof(filters) === 'undefined') ? {} : filters;

        var entityConfig = view.getEntity(),
            interceptor = view.interceptor(),
            sortEntity = sortField ? sortField.split('.')[0] : '',
            sortParams = sortEntity === entityName ? entityConfig.getSortParams(sortField.split('.').pop(), sortDir) : null,
            params = view.getAllParams(page, sortParams, query),
            headers = view.getAllHeaders(sortParams);

        filters = entityConfig.filterParams()(filters);

        // Add filters
        angular.forEach(filters, function(value, fieldName) {
            params[fieldName] = value;
        });

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
    ListViewRepository.prototype.getReferencedValues = function(view) {
        var self = this,
            references = view.getReferences(),
            calls = [];

        angular.forEach(references, function(reference) {
            // @TODO: how to pass associated view?
            calls.push(self.getRawValues(reference.getEntity().name(), 1, false))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;
                angular.forEach(references, function(reference, index) {
                    references[index].setChoices(responses[i++]);
                });

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
    ListViewRepository.prototype.getReferencedListValues = function(view, sortField, sortDir) {
        var self = this,
            lists = view.getReferencedLists(),
            entityId = view.getIdentifier().value,
            calls = [];

        angular.forEach(lists, function(list) {
            // @TODO: how to pass associated view?
            calls.push(self.getRawValues(list.targetEntity().name(), 1, false, false, null, sortField, sortDir))
        });

        return this.$q.all(calls)
            .then(function(responses) {
                var i = 0;

                angular.forEach(lists, function(referencedList) {
                    referencedList
                        .setEntries(responses[i++].entities)
                        .filterEntries(entityId);
                });

                return lists;
            });
    };

    /**
     * Fill ReferencedMany & Reference values from a collection a values
     *
     * @param {[Entity]} collection
     * @param {Array} referencedValues
     * @param {Boolean} fillSimpleReference
     *
     * @returns {Array}
     */
    ListViewRepository.prototype.fillReferencesValuesFromCollection = function (collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof(fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        angular.forEach(referencedValues, function(reference, referenceField) {
            var choices = reference.getChoices(),
                value,
                targetField;

            for (var i = 0, l = collection.length; i < l; i++) {
                var entity = collection[i],
                    identifier = reference.valueTransformer()(entity.getField(referenceField).value);

                if (reference.type() === 'reference-many') {
                    entity.getField(referenceField).value = [];

                    angular.forEach(identifier, function(id) {
                        entity.getField(referenceField).value.push(choices[id]);
                    });
                } else if (fillSimpleReference && identifier && identifier in choices) {
                    targetField = reference.targetEntity().getField(reference.targetLabel());
                    value = choices[identifier];
                    entity.getField(referenceField).referencedValue = targetField.getTruncatedListValue(value);
                }
            }
        });

        return collection;
    };

    return ListViewRepository;
});
