/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

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

    function defaultTitle(view) {
        return null;
    }

    function defaultDescription(entity) {
        return null;
    }

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
    View.prototype.setEntity = function (entity) {
        this.entity = entity;

        return this;
    };

    /***
     * @return {Entity}
     */
    View.prototype.getEntity = function (entity) {
        return this.entity;
    };

    /**
     * @param {Field} field
     */
    View.prototype.addField = function (field) {
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
    View.prototype.getFieldsOfType = function (type) {
        var results = {},
            field,
            i;

        for (i in this.fields) {
            field = this.fields[i];

            if (field.constructor.name === type) {
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
    View.prototype.getFields = function () {
        return this.fields;
    };

    /**
     * Returns a field
     *
     * @returns {Field}
     */
    View.prototype.getField = function (name) {
        return this.fields[name];
    };

    /**
     * @param {Action} action
     */
    View.prototype.addAction = function (action) {
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
    View.prototype.getActions = function () {
        return this.actions;
    };

    /**
     * Returns the views title
     *
     * @returns {String}
     */
    View.prototype.getTitle = function () {
        return getTitle(this.config.title, this);
    };

    /**
     * Returns the views description
     * @returns {String}
     */
    View.prototype.getDescription = function () {
        return getTitle(this.config.description, this);
    };

    /**
     * Returns all references
     *
     * @returns {Object}
     */
    View.prototype.getReferences = function () {
        var references = this.getFieldsOfType('Reference'),
            referencesMany = this.getFieldsOfType('ReferenceMany'),
            key;

        for (key in referencesMany) {
            references[key] = referencesMany[key];
        }

        return references;
    };

    /**
     * Returns all referenced lists
     *
     * @returns {Object}
     */
    View.prototype.getReferencedLists = function () {
        return this.getFieldsOfType('ReferencedList');
    };

    /**
     * Return configurable extra params
     *
     * @returns {Object}
     */
    View.prototype.getExtraParams = function () {
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
    View.prototype.getHeaders = function () {
        var headers = this.headers();

        return typeof (headers) === 'function' ? headers() : headers;
    };

    /**
     * Return the identifier field
     *
     * @returns {Field}
     */
    View.prototype.getIdentifier = function () {
        var i,
            field;

        for (i in this.fields) {
            field = this.fields[i];

            if (field.identifier()) {
                return field;
            }
        }

        // No identifier fields on this view, try to find it on other view
        return this.entity.identifier();
    };

    /**
     * Map raw entities (from REST response) into entities & fill reference values
     *
     * @param {[Object]} rawEntries
     *
     * @returns {[View]}
     */
    View.prototype.mapEntries = function (rawEntries) {
        var results = [],
            i,
            l;

        // Map each rawEntity to an View clone
        for (i = 0, l = rawEntries.length; i < l; i++) {
            results.push(this.mapEntry(rawEntries[i]));
        }

        return results;
    };

    /**
     * Map raw entities (from REST response) into entities & fill reference values
     *
     * @param {Object} rawEntry
     *
     * @returns {View}
     */
    View.prototype.mapEntry = function (rawEntry) {
        var fields = this.getFields(),
            result = angular.copy(this),
            field;

        for (var fieldName in fields) {
            field = fields[fieldName];

            if (field.type() === 'callback') {
                result.getField(fieldName).value = field.getCallbackValue(rawEntry);
            } else if (field.name() in rawEntry) {
                result.getField(fieldName).value = field.valueTransformer()(rawEntry[field.name()]);
            }
        }

        return result;
    };

    /**
     * Returns true is the Entity wasn't populated
     *
     * @returns {Boolean}
     */
    View.prototype.isNew = function() {
        var identifier = this.getIdentifier();

        return !identifier || identifier.value === null;
    };

    /**
     * Clear all fields
     *
     * @return {View}
     */
    View.prototype.clear = function() {
        var fields = this.getFields(),
            i;

        for (i in fields) {
            fields[i].clear();
        }

        return this;
    };

    /**
     * Remove all fields
     *
     * @return {View}
     */
    View.prototype.removeFields = function() {
        this.fields = {};

        return this;
    };

    Configurable(View.prototype, config);

    return View;
});
