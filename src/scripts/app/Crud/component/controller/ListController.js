define([], function() {
    'use strict';

    var ListController = function($scope, $location, $anchorScroll, data, CrudManager, Spinner) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.Spinner = Spinner;
        this.data = data;
        this.$anchorScroll = $anchorScroll;
        this.loadingPage = false;
        this.entityConfig = this.data.entityConfig;
        this.entityLabel = data.entityConfig.label();

        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entity = this.entityConfig;

        this.displayFilterQuery = this.entityConfig.filterQuery() !== false;

        this.computePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.computePagination = function () {
        var rawItems = this.data.rawItems,
            columns = [],
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
        this.$scope.items = rawItems;

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

        this.CrudManager.getAll(entityConfig.getName(), this.currentPage).then(function(nextData) {
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

        this.$location.path('/list/' + this.data.entityName + '/page/' + number);
        this.$anchorScroll(0);
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
     * Link to entity creation page
     */
    ListController.prototype.create = function() {
        this.$location.path('/create/' + this.data.entityName);
        this.$anchorScroll(0);
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     */
    ListController.prototype.edit = function(item) {
        this.$location.path('/edit/' + this.data.entityName + '/' + item[this.identifierField]);
        this.$anchorScroll(0);
    };

    ListController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
    };

    ListController.prototype.filter = function() {
        var entityConfig = this.data.entityConfig,
            self = this;

        this.Spinner.start();
        this.loadingPage = true;

        this.CrudManager.getAll(entityConfig.getName(), this.currentPage, null, true, this.$scope.filterQuery).then(function(data) {
            self.$scope.items = data.rawItems;
            self.loadingPage = false;
            self.Spinner.stop();
        });
    };

    ListController.prototype.clearFilter = function() {
        this.$scope.filterQuery = '';
        this.filter();
    };

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data', 'CrudManager', 'Spinner'];

    return ListController;
});
