/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils');

    var config = {
        perPage: 30,
        infinitePagination: false,
        listActions: null
    };

    /**
     * @constructor
     */
    function ListView() {
        View.apply(this, arguments);

        this.config = angular.extend(this.config, angular.copy(config));
        this.type = 'ListView';
        this.quickFilters = {};
    }

    utils.inherits(ListView, View);
    Configurable(ListView.prototype, config);

    /**
     *
     * @param {string} label
     * @param {Object} params
     *
     * @returns {ListView}
     */
    ListView.prototype.addQuickFilter = function (label, params) {
        this.quickFilters[label] = params;

        return this;
    };

    /**
     *
     * @returns {Object}
     */
    ListView.prototype.getQuickFilterNames = function () {
        return Object.keys(this.quickFilters);
    };

    /**
     * @param {String} name
     * @returns {Object}
     */
    ListView.prototype.getQuickFilterParams = function (name) {
        var params = this.quickFilters[name];
        if (typeof (params) === 'function') {
            params = params();
        }

        return params;
    };

    /**
     * Map all values depending of the `map` configuration of a field
     *
     * @param {[Object]} entries
     *
     * @return {[Object]}
     */
    ListView.prototype.getMappedValue = function (entries) {
        if (!entries.length) {
            return [];
        }

        var fields = this.getFields(),
            field,
            i,
            l,
            fieldName;

        for (i = 0, l = entries.length; i < l; i++) {
            for (fieldName in fields) {
                field = fields[fieldName];

                entries[i].values[fieldName] = field.getMappedValue(entries[i].values[fieldName], entries[i]);
            }
        }

        return entries;
    };

    return ListView;
});
