/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        ReferenceField = require('ng-admin/Main/component/service/config/fieldTypes/ReferenceField'),
        utils = require('ng-admin/lib/utils');

    var config = {
        edition: 'editable',
        targetReferenceField: null,
        targetFields: [],
        listActions: null
    };

    /**
     * @constructor
     */
    function ReferencedListField(fieldName) {
        ReferenceField.apply(this, arguments);
        this.config = angular.extend(this.config, angular.copy(config));
        this.config.isDetailLink = false;
        this.config.list = false;
        this.config.name = fieldName || 'reference';
        this.config.type = 'referenced_list';
        this.entries = [];
    }

    utils.inherits(ReferencedListField, ReferenceField);
    Configurable(ReferencedListField.prototype, config);

    /**
     * Set or get the type
     *
     * @param {[Field]} targetFields
     * @returns ReferencedList
     */
    ReferencedListField.prototype.targetFields = function (targetFields) {
        if (arguments.length === 0) {
            return this.config.targetFields;
        }
        this.referencedView.removeFields();
        this.referencedView.fields(targetFields);
        this.config.targetFields = targetFields;

        return this;
    };

    /**
     * Returns columns used to display the datagrid
     *
     * @returns {Array}
     */
    ReferencedListField.prototype.getGridColumns = function () {
        var columns = [],
            field,
            i,
            l;

        for (i = 0, l = this.config.targetFields.length; i < l; i++) {
            field = this.config.targetFields[i];
            columns.push({
                field: field,
                label: field.label()
            });
        }

        return columns;
    };

    ReferencedListField.prototype.getEntries = function () {
        return this.entries;
    };

    ReferencedListField.prototype.setEntries = function (entries) {
        this.entries = entries;

        return this;
    };

    ReferencedListField.prototype.clear = function () {
        return this;
    };

    return ReferencedListField;
});
