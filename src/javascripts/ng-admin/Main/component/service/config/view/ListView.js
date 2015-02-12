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
        listActions: null,
        filters: {},
        sortField: 'id',
        sortDir: 'DESC'
    };

    /**
     * @constructor
     */
    function ListView() {
        View.apply(this, arguments);

        this.config = angular.extend(this.config, angular.copy(config));
        this.type = 'ListView';
    }

    utils.inherits(ListView, View);

    /**
     * @param {Field} field
     * @returns {View} The current view
     */
    View.prototype.addFilter = function (field) {
        this.addElement('filters', field);
        return this;
    };

    /**
     * Smart getter / adder for filters
     *
     * @param {Array|Object|Null}
     * @returns {Array|View} The current view
     */
    View.prototype.filters = function (fields) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('filters');
        return this.smartElementGetterSetter.apply(this, args);
    };

    /**
     * Returns all filter references
     *
     * @returns {Object}
     */
    View.prototype.getFilterReferences = function () {
        var results = {},
            fields = this.config.filters,
            field,
            i;

        for (i in fields) {
            field = fields[i];
            if (field.type() === 'reference') {
                results[i] = field;
            }
        }

        return results;
    };

    Configurable(ListView.prototype, config);

    return ListView;
});
