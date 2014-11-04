/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

    function defaultValueTransformer(value) {
        return value;
    }

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
        isEditLink: false,
        validation: {
            required: false
        }
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

    /**
     * Set or get the type
     *
     * @param {[Field]} targetFields
     * @returns ReferencedList
     */
    ReferencedList.prototype.targetFields = function (targetFields) {
        if (arguments.length === 0) {
            return this.config.targetFields;
        }

        var i;

        this.referencedView.removeFields();
        for (i in targetFields) {
            this.referencedView.addField(targetFields[i]);
        }

        this.config.targetFields = targetFields;

        return this;
    };

    /**
     * Returns columns used to display the datagrid
     *
     * @returns {Array}
     */
    ReferencedList.prototype.getGridColumns = function () {
        var columns = [],
            field,
            i,
            l;

        for (i = 0, l = this.config.targetFields.length; i < l; i++) {
            field = this.config.targetFields[i];
            if (!field.displayed()) {
                continue;
            }

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
    ReferencedList.prototype.filterEntries = function (entityId) {
        var results = [],
            entry,
            targetRefField = this.targetReferenceField(),
            i,
            l;

        for (i = 0, l = this.entries.length; i < l; i++) {
            entry = this.entries[i];

            if (entry[targetRefField] == entityId) {
                results.push(entry);
            }
        }

        this.entries = results;

        return this;
    };

    ReferencedList.prototype.getEntries = function () {
        return this.entries;
    };

    ReferencedList.prototype.setEntries = function (entries) {
        this.entries = entries;

        return this;
    };

    ReferencedList.prototype.clear = function () {
        return this;
    };

    return ReferencedList;
});
