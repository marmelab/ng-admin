define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var utils = require('ng-admin/lib/utils');

    var defaultSortParams = function (field, dir) {
        return {
            params:{
                _sort: field,
                _sortDir: dir
            },
            headers: {
            }
        };
    };

    var defaultPaginationLink = function(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    };

    var defaultFilterQuery = function(query) {
        return {
            q: query
        };
    };

    var defaultFilterParams = function(params) {
        return params;
    };

    var defaultTotalItems = function(response) {
        return response.headers('X-Total-Count') || 0;
    };

    var config = {
        limit : 10,
        perPage: 30,
        pagination: defaultPaginationLink,
        filterQuery: defaultFilterQuery,
        filterParams: defaultFilterParams,
        infinitePagination: false,
        totalItems: defaultTotalItems,
        sortParams: defaultSortParams
    };

    /**
     * @constructor
     */
    function ListView() {
        this.quickFilters = {};

        View.apply(this, arguments);
        this.config = angular.extend(this.config, angular.copy(config));
    }

    /**
     *
     * @param {string} label
     * @param {Object} params
     *
     * @returns {ListView}
     */
    ListView.prototype.addQuickFilter = function(label, params) {
        this.quickFilters[label] = params;

        return this;
    };

    /**
     *
     * @returns {Object}
     */
    ListView.prototype.getQuickFilterNames = function() {
        return Object.keys(this.quickFilters);
    };

    /**
     * @param {String} name
     * @returns {Object}
     */
    ListView.prototype.getQuickFilterParams = function(name) {
        var params = this.quickFilters[name];
        if (typeof (params) === 'function') {
            params = params();
        }

        return params;
    };

    /**
     * Return configurable sorting params
     *
     * @returns {Object}
     */
    ListView.prototype.getSortParams = function(sortField, sortDir) {
        return typeof (this.config.sortParams) === 'function' ? this.config.sortParams(sortField, sortDir) : this.config.sortParams;
    };

    utils.inherits(ListView, View);
    Configurable(ListView.prototype, config);

    return ListView;
});
