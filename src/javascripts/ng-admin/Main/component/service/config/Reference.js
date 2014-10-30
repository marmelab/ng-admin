/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function defaultValueTransformer(value) {
        return value;
    }

    var config = {
        name: 'myReference',
        type: 'reference',
        label: 'My reference',
        edition : 'editable',
        order: null,
        targetEntity : null,
        targetField : null,
        valueTransformer : defaultValueTransformer,
        truncateList: false,
        list: true,
        dashboard: true,
        identifier: false,
        isEditLink: true,
        validation: {
            required: false
        },
        defaultValue: null
    };

    /**
     * @constructor
     */
    function Reference(fieldName) {
        Field.apply(this, arguments);

        this.referencedValue = null;
        this.entries = {};
        this.config.name = fieldName || 'reference';
        this.view = new ListView();
    }

    utils.inherits(Reference, Field);
    Configurable(Reference.prototype, config);

    /**
     * Returns all choices for a Reference from values : [{targetIdentifier: targetLabel}]
     *
     * @returns {Object}
     */
    Reference.prototype.getChoices = function () {
        var result = {},
            entry,
            targetEntity = this.targetEntity(),
            targetLabel = this.targetField().name(),
            targetIdentifier = targetEntity.getIdentifier().name(),
            i,
            l;

        for (i = 0, l = this.entries.length; i < l; i++) {
            entry = this.entries[i];

            result[entry[targetIdentifier]] = entry[targetLabel];
        }

        return result;
    };

    /**
     * Truncate the value based on the `truncateList` configuration
     *
     * @param {*} value
     *
     * @returns {*}
     */
    Reference.prototype.getTruncatedListValue = function (value) {
        if (this.config.truncateList) {
            value = this.config.truncateList(value);
        }

        return value;
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
        this.view.setEntity(entity);

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
        this.view
            .removeFields()
            .addField(field);

        return this;
    };

    /**
     * @returns {ListView}
     */
    Reference.prototype.getView = function () {
        return this.view;
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
     * Empty field value
     *
     * @returns {Reference}
     */
    Reference.prototype.clear = function () {
        this.value = null;

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

    Reference.prototype.processDefaultValue = function() {
        if (!this.value && this.defaultValue()) {
            this.value = this.defaultValue();
        }
    };

    Configurable(Reference.prototype, config);

    return Reference;
});
