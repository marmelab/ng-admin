/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Entry = require('ng-admin/Main/component/service/config/Entry'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        name: null,
        title: false,
        fields: {},
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
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = name;
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
     * @returns {View} The current view
     */
    View.prototype.setEntity = function (entity) {
        this.entity = entity;
        if (!this.config.name) {
            this.config.name = entity.name() + '_' + this.type;
        }

        return this;
    };

    /**
     * @returns {Entity}
     */
    View.prototype.getEntity = function () {
        return this.entity;
    };

    /**
     * @param {*} entityId
     *
     * @returns String
     */
    View.prototype.getUrl = function (entityId) {
        return typeof (this.config.url) === 'function' ? this.config.url(entityId) : this.config.url;
    };

    /**
     * @param {Field} field
     * @returns {View} The current view
     */
    View.prototype.addField = function (field) {
        this.addElement('fields', field);
        return this;
    };

    /**
     * Smart getter / adder for fields
     *
     * @param {Array|Object|Null}
     * @returns {Array|View} The current view
     */
    View.prototype.fields = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('fields');
        return this.smartElementGetterSetter.apply(this, args);
    };

    View.prototype.addElement = function (elementName, element) {
        if (element.order() === null) {
            element.order(Object.keys(this.config[elementName]).length);
        }
        this.config[elementName][element.name()] = element;

        return this;
    };

    /**
     * Smart getter / adder for anything
     *
     * @param {String} elementName
     * @param {Array|Object|Null}
     * @returns {Array|View} The current view
     */
    View.prototype.smartElementGetterSetter = function () {
        var args = Array.prototype.slice.call(arguments);
        var elementName = args.shift();
        var addElement = this.addElement.bind(this);
        function addElements(elements) {
            var i, len, key;
            for (i = 0, len = elements.length; i < len ; i++) {
                if (!elements[i].config) { // not a field - probably a hash of elements
                    for (key in elements[i]) {
                        if (!elements[i].hasOwnProperty(key)) continue;
                        addElement(elementName, elements[i][key]);
                    }
                } else {
                    addElement(elementName, elements[i]);
                }
            }
        }
        switch (args.length) {
            case 0: // getter
                return this.config[elementName];
            case 1: // setter
                var arg = args[0];
                if (arg instanceof Array) {
                    addElements(arg);
                } else {
                    addElements([arg]);
                }
                break;
            default: // multiple setter
                addElements(args);
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
            fields = this.config.fields,
            field,
            i;

        for (i in fields) {
            field = fields[i];
            if (field.type() === type) {
                results[i] = field;
            }
        }

        return results;
    };

    /**
     * Returns all fields
     * Alias for fields()
     *
     * @returns {[Field]}
     */
    View.prototype.getFields = function () {
        return this.fields();
    };

    /**
     * Returns a field
     *
     * @returns {Field}
     */
    View.prototype.getField = function (name) {
        return this.config.fields[name];
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
            fields = this.config.fields;

        for (i in fields) {
            if (fields[i].identifier()) {
                identifier = fields[i];
                break;
            }
        }

        // No identifier fields on this view, try to find it on other view
        if (!identifier) {
            identifier = this.entity.identifier();
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

        var fields = this.config.fields,
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
        this.config.fields = {};

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
