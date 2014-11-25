/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Entry = require('ng-admin/Main/component/service/config/Entry'),
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

    function defaultDescription(entry) {
        return null;
    }

    function defaultHeaders() {
        return {};
    }

    var config = {
        name: 'myView',
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
        this.enabled = true;
        this.fields = {};
        this.actions = {};
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = name || this.config.name;
    }

    View.prototype.isEnabled = function() {
        return this.enabled;
    }

    View.prototype.disable = function() {
        this.enabled = false;
        return this;
    }

    View.prototype.enable = function() {
        this.enabled = true;
        return this;
    }

    /**
     * @param {Entity} entity
     */
    View.prototype.setEntity = function (entity) {
        this.entity = entity;

        return this;
    };

    /***
     * @return {Entity}
     */
    View.prototype.getEntity = function () {
        return this.entity;
    };

    /**
     * @param {Field} field
     */
    View.prototype.addField = function (field) {
        if (field.order() === null) {
            field.order(Object.keys(this.fields).length);
        }

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

            if (field.type() === type) {
                results[i] = field;
            }
        }

        return results;
    };

    /**
     * Returns all fields
     *
     * @returns {[Field]}
     */
    View.prototype.getFields = function () {
        return this.fields;
    };

    /**
     * Returns all fields to display
     *
     * @returns {[Field]}
     */
    View.prototype.getDisplayedFields = function () {
        var result = {},
            field,
            i;

        for (i in this.fields) {
            field = this.fields[i];
            if (field.displayed()) {
                result[i] = field;
            }
        }

        return result;
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

        return typeof (headers) === 'function' ? headers(this) : headers;
    };

    /**
     * Return the identifier field
     *
     * @param {*} identifierValue
     * @returns {Field}
     */
    View.prototype.identifier = function (identifierValue) {
        var i,
            identifier,
            field;

        for (i in this.fields) {
            field = this.fields[i];

            if (field.identifier()) {
                identifier = field;
                break;
            }
        }

        // No identifier fields on this view, try to find it on other view
        if (!identifier) {
            identifier = this.entity.identifierField;
        }

        if (arguments.length === 0) {
            return identifier;
        }

        return this;
    };

    /**
     * Map raw entities (from REST response) into entries & fill reference values
     *
     * @param {[Object]} rawEntries
     *
     * @returns {[Entry]}
     */
    View.prototype.mapEntries = function (rawEntries) {
        var results = [],
            i,
            l;

        // Map each rawEntity to an Entry
        for (i = 0, l = rawEntries.length; i < l; i++) {
            results.push(this.mapEntry(rawEntries[i]));
        }

        return results;
    };

    /**
     * Map raw entry (from REST response) into entry & fill reference values
     *
     * @param {Object} rawEntry
     *
     * @returns {Entry}
     */
    View.prototype.mapEntry = function (rawEntry) {
        var fields = this.getFields(),
            extraFields = this.getEntity().getMappedFields(),
            entry = new Entry(),
            resultEntity = this.getEntity(),
            identifier = this.identifier(),
            fieldName,
            field;

        entry.entityName = resultEntity.name();

        for (fieldName in fields) {
            field = fields[fieldName];

            if (field.name() in rawEntry) {
                entry.values[fieldName] = field.getMappedValue(rawEntry[field.name()]);
            }
        }

        // Add identifier value
        if (identifier) {
            entry.identifierValue = rawEntry[identifier.name()];
        }

        // Add extra field to map
        for (fieldName in extraFields) {
            field = extraFields[fieldName];

            entry.values[fieldName] = rawEntry[field.name()];
        }

        return entry;
    };

    /**
     * Remove all fields
     *
     * @return {View}
     */
    View.prototype.removeFields = function () {
        this.fields = {};

        return this;
    };

    /**
     * Use default value for all fields
     *
     * @param {Entry} entry
     *
     * @return {View}
     */
    View.prototype.processFieldsDefaultValue = function (entry) {
        var fields = this.getFields(),
            field,
            i;

        for (i in fields) {
            field = fields[i];

            entry.values[field.name()] = field.defaultValue();
        }

        return this;
    };

    Configurable(View.prototype, config);

    return View;
});
