define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var availableTypes = ['number', 'text', 'email', 'date'];
    var availableEditions = ['read-only', 'editable'];

    var defaultValueTransformer = function(value) {
        return (typeof value == 'object' && typeof value.length == 'number') ? value : [value];
    };

    var config = {
        name: 'myReference',
        type: 'reference-many',
        label: 'My references',
        edition : 'editable',
        order: null,
        targetEntity : null,
        targetField : null,
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
     *
     * @param {String} name
     */
    function ReferenceMany(name) {
        this.entity = null;
        this.values = [];
        this.choices = {};
        this.config = angular.copy(config);
        this.config.name = name || 'reference-many';

    }

    /**
     *
     * @param {String} edition
     * @returns string|Reference
     */
    ReferenceMany.prototype.edition = function(edition) {
        if (arguments.length === 0) {
            return this.config.edition;
        }

        if (availableEditions.indexOf(edition) === -1) {
            throw new Exception('Type should be one of ' + availableTypes.join(', '));
        }

        this.config.edition = edition;
        return this;
    };

    ReferenceMany.prototype.getChoices = function() {
        return this.choices;
    };

    ReferenceMany.prototype.setChoices = function(c) {
        this.choices = c;

        return this;
    };

    /**
     * @param {Entity} entity
     */
    ReferenceMany.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @return {Entity}
     */
    ReferenceMany.prototype.getEntity = function() {
        return this.entity;
    };

    /**
     * @return {string}
     */
    ReferenceMany.prototype.getSortName = function() {
        return this.entity.name() + '.' + this.name();
    };

    ReferenceMany.prototype.clear = function() {
        this.choices = {};

        return this;
    };

    Configurable(ReferenceMany.prototype, config);

    return ReferenceMany;
});
