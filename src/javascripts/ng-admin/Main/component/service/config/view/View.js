define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var fieldTypes = {
        Field: require('ng-admin/Main/component/service/config/Field'),
        Reference: require('ng-admin/Main/component/service/config/Reference'),
        ReferencedList: require('ng-admin/Main/component/service/config/ReferencedList'),
        ReferenceMany: require('ng-admin/Main/component/service/config/ReferenceMany')
    };

    /**
     * Return the title depending if the config is a string or a function
     *
     * @param {Function} value
     * @param {Entity} entity
     * @returns {String}
     */
    function getTitle(value, entity) {
        var title = value;
        if (typeof (title) === 'function') {
            title = title(entity);
        }

        return title;
    }

    var defaultTitle = function(action, entity) {
        return action + ' ' + entity.label();
    };

    var defaultDescription = function (entity) {
        return null;
    };

    function defaultHeaders() {
        return {};
    }

    var config = {
        name: 'myView',
        label: 'My view',
        order: null,
        title: defaultTitle,
        description: defaultDescription,
        extraParams: null,
        interceptor: null,
        headers: defaultHeaders
    };

    /**
     * @constructor
     */
    function View(name) {
        this.fields = {};
        this.actions = {};
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = name || this.config.name;
    }

    /***
     * @param {Entity} entity
     */
    View.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /***
     * @return {Entity}
     */
    View.prototype.getEntity = function(entity) {
        return this.entity;
    };

    /**
     * @param {Field} field
     */
    View.prototype.addField = function(field) {
        if (field.order() === null) {
            field.order(Object.keys(this.fields).length);
        }

        field.setEntity(this);
        this.fields[field.name()] = field;

        return this;
    };

    /**
     * Returns fields by type
     *
     * @param {String }type
     * @returns {Array}
     */
    View.prototype.getFieldsOfType = function(type) {
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
     * Returns all fields
     *
     * @returns {Array}
     */
    View.prototype.getFields = function() {
      return this.fields;
    };

    /**
     * Returns a field
     *
     * @returns {Field}
     */
    View.prototype.getField = function(name) {
      return this.fields[name];
    };

    /**
     * @param {Action} action
     */
    View.prototype.addAction = function(action) {
        if (action.order() === null) {
            action.order(Object.keys(this.actions).length);
        }

        this.actions[action.name()] = action;

        return this;
    };

    /**
     * Returns all actions
     *
     * @returns {Array}
     */
    View.prototype.getActions = function() {
        return this.actions;
    };

    /**
     * Returns the views title
     *
     * @returns {String}
     */
    View.prototype.getTitle = function() {
        return getTitle(this.config.title, this);
    };

    /**
     * Returns the views description
     * @returns {String}
     */
    View.prototype.getDescription = function() {
        return getTitle(this.config.description, this);
    };

    /**
     * Returns all references
     *
     * @returns {Object}
     */
    View.prototype.getReferences = function() {
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
    View.prototype.getReferencedLists = function() {
        return this.getFieldsOfType('ReferencedList')
    };

    /**
     * Return configurable extra params
     *
     * @returns {Object}
     */
    View.prototype.getExtraParams = function() {
        var params = {};
        if (this.config.extraParams) {
            params = typeof (this.config.extraParams) === 'function' ? this.config.extraParams() : this.config.extraParams;
        }

        return params;
    };

    /**
     * Return view headers
     *
     * @returns {Object}
     */
    View.prototype.getHeaders = function() {
        var headers = this.headers();

        return typeof(headers) === 'function' ? headers() : headers;
    };

    /**
     * Return the identifier field
     *
     * @returns {Field}
     */
    View.prototype.getIdentifier = function() {
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
     * Map raw entities (from REST response) into entities & fill reference values
     *
     * @param {[Object]} rawEntities
     *
     * @returns {[Entity]}
     */
    View.prototype.mapEntities = function (rawEntities) {
        var results = [],
            fields = this.getFields();

        // Map each rawEntity to an View clone
        for (var i = 0, l = rawEntities.length; i < l; i++) {
            var rawEntity = rawEntities[i],
                result = angular.copy(this),
                field;

            for (var fieldName in fields) {
                field = fields[fieldName];

                if (field.type() === 'callback') {
                    result.getField(fieldName).value = field.getCallbackValue(rawEntity);
                } else if (field.name() in rawEntity) {
                    result.getField(fieldName).value = field.valueTransformer()(rawEntity[field.name()]);
                }
            }

            results.push(result);
        }

        return results;
    };

    /**
     * Returns true is the Entity wasn't populated
     *
     * @returns {boolean}
     */
    View.prototype.isNew = function() {
        var identifier = this.getIdentifier();
        return !identifier || identifier.value === null;
    };

    /**
     * Clear all fields
     */
    View.prototype.clear = function() {
        angular.forEach(this.getFields(), function(field){
            field.clear();
        });
    };

    Configurable(View.prototype, config);

    return View;
});
