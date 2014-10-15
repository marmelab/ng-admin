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
        this.choices = {};
        this.config = angular.copy(config);
        this.config.name = fieldName || 'reference';
    }

    Configurable(Reference.prototype, config);

    Reference.prototype.getChoices = function() {
        return this.choices;
    };

    Reference.prototype.setChoices = function(c) {
        this.choices = c;

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
