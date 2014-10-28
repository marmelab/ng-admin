define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var defaultValueTransformer = function(value) {
        return value;
    };

    var config = {
        name: 'myReference',
        type: 'reference',
        label: 'My reference',
        edition : 'editable',
        order: null,
        targetEntity : null,
        targetLabel : null,
        valueTransformer : defaultValueTransformer,
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
        this.entity = null;
        this.value = null;
        this.referencedValue = null;
        this.entries = {};
        this.config = angular.copy(config);
        this.config.name = fieldName || 'reference';
    }

    Configurable(Reference.prototype, config);


    /**
     * Returns all choices for a Reference from values : [{targetIdentifier: targetLabel}]
     *
     * @returns {Object}
     */
    Reference.prototype.getChoices = function() {
        var result = {},
            targetEntity = this.targetEntity(),
            targetLabel = this.targetLabel(),
            targetIdentifier = targetEntity.getIdentifier().name();

        angular.forEach(this.entries, function(entry) {
            result[entry[targetIdentifier]] = entry[targetLabel];
        });

        return result;
    };

    /**
     * @returns {Object[]}
     */
    Reference.prototype.getEntries = function() {
        return this.entries;
    };

    /**
     * @param {Object[]} entries
     * @returns {Reference}
     */
    Reference.prototype.setEntries = function(entries) {
        this.entries = entries;

        return this;
    };

    /**
     * @param {Entity} entity
     */
    Reference.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @return {Entity}
     */
    Reference.prototype.getEntity = function() {
        return this.entity;
    };

    /**
     * @return {string}
     */
    Reference.prototype.getSortName = function() {
        return this.entity.name() + '.' + this.name();
    };

    /**
     * Empty field value
     *
     * @returns {Reference}
     */
    Reference.prototype.clear = function() {
        this.value = null;

        return this;
    };

    /**
     * Returns value used in list
     *
     * @returns mixed
     */
    Reference.prototype.getListValue = function() {
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
