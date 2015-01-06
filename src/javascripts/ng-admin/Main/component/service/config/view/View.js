/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Entry = require('ng-admin/Main/component/service/config/Entry'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        name: null,
        title: false,
        actions: null,
        description: '',
        template: null,
        url: null,
    };

    /**
     * @constructor
     */
    function View(name) {
        this.enabled = true;
        this.fields = {};
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = name;
        this.displayedFields = [];
    }

    View.prototype.isEnabled = function () {
        return this.enabled;
    };

    View.prototype.disable = function () {
        this.enabled = false;
        return this;
    };

    View.prototype.enable = function () {
        this.enabled = true;
        return this;
    };

    /**
     * @param {Entity} entity
     */
    View.prototype.setEntity = function (entity) {
        this.entity = entity;
        if (!this.config.name) {
            this.config.name = entity.name() + '_' + this.type;
        }

        return this;
    };

    /**
     * @return {Entity}
     */
    View.prototype.getEntity = function () {
        return this.entity;
    };

    /**
     * @param {*} entityId
     *
     * @return String
     */
    View.prototype.getUrl = function (entityId) {
        return typeof (this.config.url) === 'function' ? this.config.url(entityId) : this.config.url;
    };

    /**
     * @param {Field} field
     */
    View.prototype.addField = function (field) {
        if (field.order() === null) {
            field.order(Object.keys(this.fields).length);
        }

        this.fields[field.name()] = field;

        if (field.displayed()) {
            this.displayedFields[field.name()] = field;
        }

        return this;
    };

    /**
     * Returns fields by type
     *
     * @param {String} type
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
     * Returns a field
     *
     * @returns {Field}
     */
    View.prototype.getField = function (name) {
        return this.fields[name];
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
     * Return the identifier field
     *
     * @returns {Field}
     */
    View.prototype.identifier = function () {
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
        if (!rawEntry) {
            return new Entry();
        }

        var fields = this.getFields(),
            entry = new Entry(),
            resultEntity = this.getEntity(),
            identifier = this.identifier(),
            fieldName,
            field;

        entry.entityName = resultEntity.name();

        // copy all properties from the REST response in the entry
        entry.values = rawEntry;

        // set values based on fields
        for (fieldName in fields) {
            field = fields[fieldName];

            if (field.name() in rawEntry) {
                entry.values[fieldName] = field.getMappedValue(rawEntry[field.name()], rawEntry);
            }
        }

        // Add identifier value
        if (identifier) {
            entry.identifierValue = rawEntry[identifier.name()];
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
