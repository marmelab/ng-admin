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
        this.filtersView = null;
    }

    utils.inherits(ListView, View);

    /**
     * @param {Field} field
     * @returns {View} The current view
     */
    View.prototype.addFilter = function (field) {
        this.initFiltersView();

        this.filtersView.addField(field);

        return this;
    };

    /**
     * Smart getter / adder for filters
     *
     * @param {Array|Object}
     * @returns {Array|View} The current view
     */
    View.prototype.filters = function (fields) {
        this.initFiltersView();

        this.filtersView.fields(fields);

        return this;
    };

    /**
     * Filter view fields getter
     *
     * @returns {View} The filter View fields
     */
    View.prototype.getFiltersView = function () {
        return this.filtersView;
    };

    /**
     * Filter view fields getter
     *
     * @returns {Object} The filter View fields
     */
    View.prototype.getFiltersFields = function () {
        return this.filtersView ? this.filtersView.fields() : {};
    };

    /**
     * Filter view initialisation
     */
    View.prototype.initFiltersView = function () {
        if (this.filtersView) {
            return;
        }

        this.filtersView = new View('FiltersView');
        this.filtersView.setEntity(this.getEntity());
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

    Configurable(ListView.prototype, config);

    return ListView;
});
