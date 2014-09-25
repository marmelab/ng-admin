define(function(require) {
    'use strict';

    var NProgress = require('nprogress');

    var ListController = function($scope, $location, $anchorScroll, data, CrudManager) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.data = data;
        this.$anchorScroll = $anchorScroll;
        this.loadingPage = false;
        this.entityConfig = this.data.entityConfig;
        this.entityLabel = data.entityConfig.label();
        this.title = data.entityConfig.getListTitle();
        this.description = data.entityConfig.getDescription();

        var searchParams = this.$location.search();

        this.$scope.filterQuery = 'q' in searchParams ? searchParams.q : '';
        this.$scope.sortField = 'sortField' in searchParams ? searchParams.sortField : '';
        this.$scope.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';
        this.currentQuickFilter = 'quickFilter' in searchParams ? searchParams.quickFilter : null;

        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);
        this.$scope.sort = this.sort.bind(this);
        this.$scope.isSorting = this.isSorting.bind(this);
        this.$scope.entities = data.entities;
        this.$scope.entityConfig = this.entityConfig;

        this.quickFilters = this.entityConfig.getQuickFilterNames();
        this.displayFilterQuery = this.entityConfig.filterQuery() !== false;

        this.computePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.computePagination = function () {
        var columns = [],
            self = this;

        // Get identifier field, and build columns array (with only the fields defined with `"list" : true`)
        angular.forEach(this.entityConfig.getFields(), function(field) {
            if(!field.list()) {
                return;
            }

            columns.push({
                field: field,
                label: field.label()
            });
        });

        this.$scope.columns = columns;

        this.infinitePagination = this.entityConfig.infinitePagination();
        this.currentPage = this.data.currentPage;
        this.offsetBegin = (this.data.currentPage - 1) * this.data.perPage;
        this.offsetEnd = Math.min((this.data.currentPage) * this.data.perPage, this.data.totalItems);
        this.totalItems = this.data.totalItems;

        this.nbPages = Math.ceil(this.data.totalItems / (this.data.perPage || 1)) || 1;
    };

    ListController.prototype.nextPage = function() {
        var entityConfig = this.data.entityConfig;
        if (this.loadingPage || !entityConfig.infinitePagination() || this.currentPage === this.nbPages) {
            return;
        }

        var self = this;

        this.loadingPage = true;
        this.currentPage++;

        NProgress.start();
        this.CrudManager.getAll(entityConfig.name(), this.currentPage, null, true, null, this.$scope.sortField, this.$scope.sortDir).then(function(nextData) {
            NProgress.done();
            self.$scope.entities = self.$scope.entities.concat(nextData.entities);
            self.loadingPage = false;
        });
    };

    /**
     * Link to page number of the list
     *
     * @param {int} number
     */
    ListController.prototype.setPage = function (number) {
        if(number <= 0 || number > this.nbPages) {
            return;
        }

        this.changePage(this.$scope.filterQuery, number, this.$scope.sortField, this.$scope.sortDir);
    };

    ListController.prototype.filter = function() {
        this.changePage(this.$scope.filterQuery, 1, this.$scope.sortField, this.$scope.sortDir);
    };

    ListController.prototype.quickFilter = function(label) {
        this.changePage(this.$scope.filterQuery, 1, this.$scope.sortField, this.$scope.sortDir, label);
    };

    ListController.prototype.clearFilter = function() {
        this.$scope.filterQuery = '';
        this.filter();
    };

    /**
     * @param {Field} field
     */
    ListController.prototype.sort = function(field) {
        var dir = 'ASC',
            fieldName = field.getSortName();

        if (this.$scope.sortField === fieldName) {
            dir = this.$scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.changePage(this.$scope.filterQuery, 1, fieldName, dir);
    };

    ListController.prototype.changePage = function(filter, page, sortField, sortDir, quickFilterName) {
        if (!filter.length) {
            filter = null;
        }

        this.$location.search('q', filter);
        this.$location.search('page', page);
        this.$location.search('sortField', sortField);
        this.$location.search('sortDir', sortDir);
        this.$location.search('quickFilter', quickFilterName);
        this.$location.path('/list/' + this.data.entityName);
        this.$anchorScroll(0);
    };

    ListController.prototype.clearParams = function() {
        this.$location.search('q', null);
        this.$location.search('page', null);
        this.$location.search('sortField', null);
        this.$location.search('sortDir', null);
    };

    /**
     * Return an array with the range between min & max, usefull for pagination
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */
    ListController.prototype.range = function(min, max){
        var input = [];

        for (var i = min; i <= max; i ++) {
            input.push(i);
        }

        return input;
    };

    /**
     * Return 'even'|'odd' based on the index parameter
     *
     * @param {Number} index
     * @returns {string}
     */
    ListController.prototype.itemClass = function(index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */
    ListController.prototype.isSorting = function(field) {
        return this.$scope.sortField === field.getSortName();
    };

    /**
     * Link to entity creation page
     */
    ListController.prototype.create = function() {
        this.clearParams();

        this.$location.path('/create/' + this.data.entityName);
        this.$anchorScroll(0);
    };

    /**
     * Link to edit entity page
     *
     * @param {Entity} entity
     */
    ListController.prototype.edit = function(entity) {
        this.clearParams();

        this.$location.path('/edit/' + entity.name() + '/' + entity.getIdentifier().value);
        this.$anchorScroll(0);
    };

    ListController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
    };

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data', 'CrudManager'];

    return ListController;
});
