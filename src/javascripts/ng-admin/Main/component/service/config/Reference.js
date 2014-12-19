/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    var config = {
        name: 'myReference',
        type: 'reference',
        label: 'My reference',
        singleApiCall: null,
        targetEntity : null,
        targetField : null,
        isDetailLink: null,
        validation: {
            required: false
        }
    };

    /**
     * @constructor
     */
    function Reference(fieldName) {
        Field.apply(this, arguments);
        this.config.isDetailLink = true; // because the Field constructor overrides the default
        this.referencedValue = null;
        this.entries = {};
        this.config.name = fieldName || 'reference';
        this.config.type = 'Reference';
        this.referencedView = new ListView();
        this.referencedViewConfigured = false;
    }

    utils.inherits(Reference, Field);
    Configurable(Reference.prototype, config);

    /**
     * Returns all choices by id for a Reference from values : [{targetIdentifier: targetLabel}]
     *
     * @returns {Object}
     */
    Reference.prototype.getChoicesById = function () {
        var result = {},
            entry,
            targetEntity = this.targetEntity(),
            targetLabel = this.targetField().name(),
            targetIdentifier = targetEntity.identifier().name(),
            i,
            l;

        for (i = 0, l = this.entries.length; i < l; i++) {
            entry = this.entries[i];

            result[entry.values[targetIdentifier]] = entry.values[targetLabel];
        }

        return result;
    };

    /**
     * Returns all choices for a Reference from values : [{value: targetIdentifier, label: targetLabel}]
     *
     * @returns {Array}
     */
    Reference.prototype.choices = function () {
        var results = [],
            entry,
            targetEntity = this.targetEntity(),
            targetLabel = this.targetField().name(),
            targetIdentifier = targetEntity.identifier().name(),
            i,
            l;

        for (i = 0, l = this.entries.length; i < l; i++) {
            entry = this.entries[i];

            results.push({
                value: entry.values[targetIdentifier],
                label: entry.values[targetLabel]
            });
        }

        return results;
    };

    /**
     * Set or get the targeted entity
     *
     * @param {Entity} entity
     *
     * @returns {Entity|Reference}
     */
    Reference.prototype.targetEntity = function (entity) {
        if (arguments.length === 0) {
            return this.config.targetEntity;
        }

        this.config.targetEntity = entity;
        this.referencedView.setEntity(entity);

        return this;
    };

    /**
     * Set or get the targeted entity
     *
     * @param {Field} field
     *
     * @returns {Field|Reference}
     */
    Reference.prototype.targetField = function (field) {
        if (arguments.length === 0) {
            return this.config.targetField;
        }

        this.config.targetField = field;
        this.referencedView
            .removeFields()
            .addField(field);

        return this;
    };

    /**
     * @returns {ListView} a fake view that keep information about the targeted entity
     */
    Reference.prototype.getReferencedView = function () {
        // The configuration of the referencedView should be done after all entities are defined
        // otherwise the ListView should not be defined when setting a targetEntity
        if (!this.referencedViewConfigured) {
            // Use the same configuration as the listView of this entity
            var listView = this.targetEntity().getViewByType('ListView');
            if (listView) {
                this.referencedView.config = angular.copy(listView.config);
                this.referencedView.config.pagination = false;
            }

            this.referencedViewConfigured = true;
        }

        return this.referencedView;
    };

    Reference.prototype.getSingleApiCall = function (identifiers) {
        return typeof this.config.singleApiCall === 'function' ? this.config.singleApiCall(identifiers) : this.config.singleApiCall;
    };

    Reference.prototype.getSortFieldName = function () {
        return this.getReferencedView().name() + '.' + this.targetField().name();
    };

    /**
     * Returns identifier values from a collection of raw values
     *
     * @param {Array} rawValues
     *
     * @returns {Array}
     */
    Reference.prototype.getIdentifierValues = function (rawValues) {
        var results = {},
            identifierName = this.name(),
            identifier,
            i, j, l;

        for (i = 0, l = rawValues.length; i < l; i++) {
            identifier = rawValues[i][identifierName];

            // Handle array identifier (for ReferencedMany)
            if (identifier instanceof Array) {
                for (j in identifier) {
                    results[identifier[j]] = true;
                }
            } else {
                results[identifier] = true;
            }
        }

        return Object.keys(results);
    };

    /**
     * @returns {[Object]}
     */
    Reference.prototype.getEntries = function () {
        return this.entries;
    };

    /**
     * @param {[Object]} entries
     * @returns {Reference}
     */
    Reference.prototype.setEntries = function (entries) {
        this.entries = entries;

        return this;
    };

    /**
     * Returns value used in list
     *
     * @returns mixed
     */
    Reference.prototype.getListValue = function () {
        return this.referencedValue;
    };

    return Reference;
});
