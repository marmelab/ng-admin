define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var defaultValueTransformer = function(value) {
        return value;
    };

    var config = {
        name: 'myReference',
        type: 'referenced-list',
        label: 'My list',
        edition : 'editable',
        list: false,
        order: null,
        valueTransformer : defaultValueTransformer,
        targetReferenceField : null,
        targetFields : [],
        isEditLink: true,
        validation: {
            required: false
        },
        defaultValue: null
    };

    /**
     * @constructor
     */
    function ReferencedList(fieldName) {
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = fieldName || 'reference';

        this.entries = [];
    }

    ReferencedList.prototype.getReferenceManyFields = function() {
        var fields = [];

        angular.forEach(this.targetFields(), function(targetField) {
            if (targetField.type() === 'reference-many') {
                fields.push(targetField);
            }
        });

        return fields;
    };

    ReferencedList.prototype.getGridColumns = function() {
        var columns = [];

        for (var i = 0, l = this.config.targetFields.length; i < l; i++) {
            var field = this.config.targetFields[i];

            columns.push({
                field: field,
                label: field.label()
            });
        }

        return columns;
    };

    /**
     * Returns only referencedList values for an entity (filter it by identifier value)
     *
     * @param {String|Number}  entityId
     *
     * @returns {ReferencedList}
     */
    ReferencedList.prototype.filterEntries = function(entityId) {
        var results = [],
            targetRefField = this.targetReferenceField();

        angular.forEach(this.entries, function(entry) {
            if (entry[targetRefField] == entityId) {
                results.push(entry);
            }
        });

        this.entries = results;

        return this;
    };

    /**
     * @param {Entity} entity
     */
    ReferencedList.prototype.setEntity = function(entity) {
        this.entity = entity;

        return this;
    };

    /**
     * @return {Entity}
     */
    ReferencedList.prototype.getEntity = function() {
        return this.entity;
    };

    ReferencedList.prototype.getEntries = function() {
        return this.entries;
    };

    ReferencedList.prototype.setEntries = function(entries) {
        this.entries = entries;

        return this;
    };

    /**
     * @return {string}
     */
    ReferencedList.prototype.getSortName = function() {
        return this.entity.name() + '.' + this.name();
    };

    ReferencedList.prototype.clear = function() {
        return this;
    };

    ReferencedList.prototype.processDefaultValue = function() {
        if (!this.value && this.defaultValue()) {
            this.value = this.defaultValue();
        }
    };

    Configurable(ReferencedList.prototype, config);

    return ReferencedList;
});
