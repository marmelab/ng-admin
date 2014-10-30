/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils');

    function defaultSortParams(field, dir) {
        return {
            params: {
                _sort: field,
                _sortDir: dir
            },
            headers: {
            }
        };
    }

    function defaultPaginationLink(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    }

    function defaultFilterQuery (query) {
        return {
            q: query
        };
    }

    function defaultFilterParams(params) {
        return params;
    }

    function defaultTotalItems(response) {
        if (!response.headers && response.length) {
            return response.length;
        }

        return response.headers('X-Total-Count') || 0;
    }

    var config = {
        limit : 10,
        perPage: 30,
        pagination: defaultPaginationLink,
        filterQuery: defaultFilterQuery,
        filterParams: defaultFilterParams,
        infinitePagination: false,
        totalItems: defaultTotalItems,
        sortParams: defaultSortParams,
        headers: {}
    };

    /**
     * @constructor
     */
    function ListView() {
        this.quickFilters = {};

        View.apply(this, arguments);
        this.config = angular.extend(this.config, angular.copy(config));
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
     * Return configurable sorting params
     *
     * @returns {Object}
     */
    ListView.prototype.getSortParams = function (sortField, sortDir) {
        return typeof (this.config.sortParams) === 'function' ? this.config.sortParams(sortField, sortDir) : this.config.sortParams;
    };

    /**
     * Returns all params used to retrieve all elements
     *
     * @param {Number} page
     * @param {Object} sortParams
     * @param {String} query
     *
     * @returns {Object}
     */
    ListView.prototype.getAllParams = function (page, sortParams, query) {
        var params = this.getExtraParams(),
            pagination = this.pagination(),
            perPage = this.perPage();

        // Add pagination params
        if (pagination) {
            params = angular.extend(params, pagination(page, perPage));
        }

        // Add sort params
        if (sortParams && 'params' in sortParams) {
            params = angular.extend(params, sortParams.params);
        }

        // Add query params
        if (query && query.length) {
            var filterQuery = this.filterQuery();
            params = angular.extend(params, filterQuery(query));
        }

        return params;
    };

    /**
     * Returns all headers used to retrieve all elements
     *
     * @param {Object} sortParams
     *
     * @returns {Object}
     */
    ListView.prototype.getAllHeaders = function(sortParams) {
        var headers = this.getHeaders();

        // Add sort param headers
        if (sortParams && sortParams.headers) {
            headers = angular.extend(headers, sortParams.headers);
        }

        return headers;
    };

    /**
     * Truncate all values depending of the `truncateList` configuration of a field
     *
     * @param {[Object]} entities
     *
     * @return {[Object]}
     */
    ListView.prototype.truncateListValue = function (entities) {
        if (!entities.length) {
            return [];
        }

        var fields = this.getFieldsOfType('Field'),
            i,
            l,
            fieldName;

        for (i = 0, l = entities.length; i < l; i++) {
            for (fieldName in fields) {
                entities[i][fieldName] = fields[fieldName].getTruncatedListValue(entities[i][fieldName]);
            }
        }

        return entities;
    };

    return ListView;
});
