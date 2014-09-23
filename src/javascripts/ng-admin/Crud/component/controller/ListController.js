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

        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);
        this.$scope.sort = this.sort.bind(this);
        this.$scope.isSorting = this.isSorting.bind(this);
        this.$scope.entity = this.entityConfig;
        this.$scope.entity = this.entityConfig;
        this.$scope.items = data.rawItems;

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

            if(field.identifier()) {
                self.identifierField = field.getName();
            }

            columns.push({
                field: field.getName(),
                label: field.label()
            });
        });

        this.$scope.columns = columns;

        this.infinitePagination = this.entityConfig.infinitePagination();
        this.currentPage = this.data.currentPage;
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
        this.CrudManager.getAll(entityConfig.getName(), this.currentPage, null, true, null, this.$scope.sortField, this.$scope.sortDir).then(function(nextData) {
            NProgress.done();
            self.$scope.items = self.$scope.items.concat(nextData.rawItems);
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

    ListController.prototype.clearFilter = function() {
        this.$scope.filterQuery = '';
        this.filter();
    };

    ListController.prototype.sort = function(entity, field) {
        var dir = 'ASC',
            field = entity.getName() + '.' + field;

        if (this.$scope.sortField === field) {
            dir = this.$scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.changePage(this.$scope.filterQuery, 1, field, dir);
    };

    ListController.prototype.changePage = function(filter, page, sortField, sortDir) {
        if (!filter.length) {
            filter = null;
        }

        this.$location.search('q', filter);
        this.$location.search('page', page);
        this.$location.search('sortField', sortField);
        this.$location.search('sortDir', sortDir);
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
     * @param {Entity} entity
     * @param {String} field
     *
     * @returns {Boolean}
     */
    ListController.prototype.isSorting = function(entity, field) {
        return this.$scope.sortField === entity.getName() + '.' + field;
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
     * @param {Object} item
     */
    ListController.prototype.edit = function(item) {
        this.clearParams();

        this.$location.path('/edit/' + this.data.entityName + '/' + item[this.identifierField]);
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
