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
        targetEntity : null,
        targetField : null,
        targetFields : [],
        isEditLink: true,
        validation: {
            required: false
        }
    };

    /**
     * @constructor
     */
    function ReferencedList(fieldName) {
        this.entity = null;
        this.config = angular.copy(config);
        this.config.name = fieldName || 'reference';
    }

    ReferencedList.prototype.getItems = function() {
        return items;
    };

    ReferencedList.prototype.setItems = function(i) {
        items = i;

        return this;
    };

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

    /**
     * @return {string}
     */
    ReferencedList.prototype.getSortName = function() {
        return this.entity.name() + '.' + this.name();
    };

    ReferencedList.prototype.clear = function() {
        return this;
    };

    Configurable(ReferencedList.prototype, config);

    return ReferencedList;
});
