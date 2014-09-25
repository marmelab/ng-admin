define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var availableTypes = ['number', 'text', 'email', 'date'];
    var availableEditions = ['read-only', 'editable'];

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
        }
    };

    /**
     * @constructor
     */
    function Reference(fieldName) {
        this.entity = null;
        this.value = null;
        this.choices = {};
        this.config = angular.copy(config);
        this.config.name = fieldName || 'reference';
    }

    /**
     *
     * @param {String} edition
     * @returns string|Reference
     */
    Reference.prototype.edition = function(edition) {
        if (arguments.length === 0) {
            return this.config.edition;
        }

        if (availableEditions.indexOf(edition) === -1) {
            throw new Exception('Type should be one of ' + availableTypes.join(', '));
        }

        this.config.edition = edition;
        return this;
    };

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

    Configurable(Reference.prototype, config);

    return Reference;
});
