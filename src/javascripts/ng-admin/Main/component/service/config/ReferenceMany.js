define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

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
        },
        defaultValue: null
    };

    /**
     * @constructor
     *
     * @param {String} name
     */
    function ReferenceMany(name) {
        this.entity = null;
        this.value = [];
        this.choices = {};
        this.config = angular.copy(config);
        this.config.name = name || 'reference-many';
    }


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
        this.value = [];

        return this;
    };

    ReferenceMany.prototype.processDefaultValue = function() {
        if (!this.value && this.defaultValue()) {
            this.value = this.defaultValue();
        }
    };

    Configurable(ReferenceMany.prototype, config);

    return ReferenceMany;
});
