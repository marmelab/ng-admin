/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
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
    function ReferencedList(fieldName) {
        Reference.apply(this, arguments);
        this.config = angular.extend(this.config, angular.copy(config));
        this.config.list = false;
        this.config.name = fieldName || 'reference';
        this.config.type = 'ReferencedList';
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
    ReferencedList.prototype.getGridColumns = function () {
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
