define(function (require) {
    'use strict';

    var angular = require('angular');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var fieldTypes = {
        Field: require('ng-admin/Main/component/service/config/Field'),
        Reference: require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList: require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany: require('ng-admin/Main/component/service/config/ReferenceMany')
    };

    /**
     * Return the title depending if the config is a string or a function
     * @param {Function} config
     * @param {Entity} entity
     * @returns {String}
     */
    function getTitle(config, entity) {
        var title = config;
        if (typeof (title) === 'function') {
            title = title(entity);
        }

        return title;
    }

    var defaultPaginationLink = function(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    };

    var defaultFilterQuery = function(query) {
        return {
            q: query
        };
    };

    var defaultFilterParams = function(params) {
        return params;
    };

    var defaultTotalItems = function(response) {
        return response.headers('X-Total-Count') || 0;
    };

    var defaultListingTitle = function(entity) {
        return 'List of ' + entity.label();
    };

    var defaultEditionTitle = function(entity) {
        return 'Edit ' + entity.label();
    };

    var defaultCreationTitle = function(entity) {
        return 'Create ' + entity.label();
    };

    var defaultDescription = function (entity) {
        return null;
    };

    var defaultSortParams = function (field, dir) {
        return {
            params:{
                _sort: field,
                _sortDir: dir
            },
            headers: {
            }
        };
    };

    var config = {
        name: 'entity',
        label: 'My entity',
        order: null,
        titleList: defaultListingTitle,
        titleCreate: defaultCreationTitle,
        titleEdit: defaultEditionTitle,
        description: defaultDescription,
        dashboard: 5,
        perPage: 30,
        pagination: defaultPaginationLink,
        filterQuery: defaultFilterQuery,
        filterParams: defaultFilterParams,
        infinitePagination: false,
        totalItems: defaultTotalItems,
        extraParams: null,
        sortParams: defaultSortParams,
        interceptor: null
    };

    /**
     * @param {String} entityName
     *
     * @constructor
     */
    function Entity(entityName) {
        this.fields = {};
        this.quickFilters = {};
        this.config = angular.copy(config);
        this.config.name = entityName || 'entity';
    }

    /**
     * Add an field to the entity
     * @param {Field} field
     */
    Entity.prototype.addField = function(field) {
        if (field.order() === null) {
            field.order(Object.keys(this.fields).length);
        }

        field.setEntity(this);
        this.fields[field.name()] = field;

        return this;
    };

    /**
     * Returns all fields
     *
     * @returns {Object}
     */
    Entity.prototype.getFields = function() {
        return this.fields;
    };

    /**
     * Returns a field
     *
     * @returns {Field}
     */
    Entity.prototype.getField = function(name) {
        return this.fields[name];
    };

    /**
     * Return the identifier field
     *
     * @returns {Field}
     */
    Entity.prototype.getIdentifier = function() {
        for(var i in this.fields) {
            if (!this.fields.hasOwnProperty(i)){
                continue;
            }

            var field = this.fields[i];
            if (field.identifier()) {
                return field;
            }
        }
    };

    /**
     * Returns all references
     *
     * @returns {Object}
     */
    Entity.prototype.getReferences = function() {
        var references = this.getFieldsOfType('Reference');
        var referencesMany = this.getFieldsOfType('ReferenceMany');

        angular.forEach(referencesMany, function(ref, key) {
            references[key] = ref;
        });

        return references;
    };

    /**
     * Returns all referenced lists
     *
     * @returns {Object}
     */
    Entity.prototype.getReferencedLists = function() {
        return this.getFieldsOfType('ReferencedList')
    };

    /**
     * Returns fields by type
     *
     * @param {String }type
     * @returns {Array}
     */
    Entity.prototype.getFieldsOfType = function(type) {
        var results = {};

        for(var i in this.fields) {
            if (!this.fields.hasOwnProperty(i)) {
                continue;
            }

            var field = this.fields[i];
            if (field instanceof fieldTypes[type]) {
                results[i] = field;
            }
        }

        return results;
    };

    /**
     * Return configurables extra params
     *
     * @returns {Object}
     */
    Entity.prototype.getExtraParams = function() {
        var params = {};
        if (this.config.extraParams) {
            params = typeof (this.config.extraParams) === 'function' ? this.config.extraParams() : this.config.extraParams;
        }

        return params;
    };

    /**
     * Return configurables sorting params
     *
     * @returns {Object}
     */
    Entity.prototype.getSortParams = function(sortField, sortDir) {
        return typeof (this.config.sortParams) === 'function' ? this.config.sortParams(sortField, sortDir) : this.config.sortParams;
    };

    Entity.prototype.getListTitle = function() {
        return getTitle(this.config.titleList, this);
    };

    Entity.prototype.getCreateTitle = function() {
        return getTitle(this.config.titleCreate, this);
    };

    Entity.prototype.getEditTitle = function() {
        return getTitle(this.config.titleEdit, this);
    };

    Entity.prototype.getDescription = function() {
        return getTitle(this.config.description, this);
    };

    Entity.prototype.addQuickFilter = function(label, params) {
        this.quickFilters[label] = params;

        return this;
    };

    Entity.prototype.getQuickFilterNames = function() {
        return Object.keys(this.quickFilters);
    };

    Entity.prototype.getQuickFilterParams = function(name) {
        var params = this.quickFilters[name];
        if (typeof (params) === 'function') {
            params = params();
        }

        return params;
    };

    /**
     * Returns true is the Entity wasn't populated
     *
     * @returns {boolean}
     */
    Entity.prototype.isNew = function() {
        var identifier = this.getIdentifier();
        return !identifier || identifier.value === null;
    };

    /**
     * Clear all fields
     */
    Entity.prototype.clear = function() {
        angular.forEach(this.getFields(), function(field){
            field.clear();
        });
    };

    Configurable(Entity.prototype, config);

    return Entity;
});
