define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

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
        Reference.apply(this, arguments);

        this.config.name = fieldName || 'reference';
        this.config.type = 'referenced-list';
        this.entries = [];
    }

    utils.inherits(ReferencedList, Reference);
    Configurable(ReferencedList.prototype, config);

    ReferencedList.prototype.getReferenceManyFields = function() {
        var fields = [];

        angular.forEach(this.targetFields(), function(targetField) {
            if (targetField.constructor.name === 'ReferenceMany') {
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
            entry,
            targetRefField = this.targetReferenceField();

        for (var i = 0, l = this.entries.length; i < l; i ++) {
            entry = this.entries[i];

            if (entry[targetRefField] == entityId) {
                results.push(entry);
            }
        }

        this.entries = results;

        return this;
    };

    ReferencedList.prototype.getEntries = function() {
        return this.entries;
    };

    ReferencedList.prototype.setEntries = function(entries) {
        this.entries = entries;

        return this;
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
