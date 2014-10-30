/*global define*/

define(function (require) {
    'use strict';

    function DatagridPaginationController($scope, $location, $anchorScroll, CrudManager, progress) {
        this.$scope = $scope;
        this.$location = $location;
        this.loadingPage = false;
        this.$anchorScroll = $anchorScroll;
        this.CrudManager = CrudManager;
        this.progress = progress;
    }

    DatagridPaginationController.prototype.computePagination = function () {
        var perPage = this.$scope.entityConfig.perPage(),
            currentPage = this.$location.search().page || 1,
            totalItems = this.$scope.totalItems;

        this.infinitePagination = this.$scope.hasPagination && this.$scope.entityConfig.infinitePagination();
        this.currentPage = currentPage;
        this.offsetBegin = (currentPage - 1) * perPage + 1;
        this.offsetEnd = Math.min(currentPage * perPage, totalItems);
        this.totalItems = totalItems;

        this.nbPages = Math.ceil(totalItems / (perPage || 1)) || 1;
    };

    /**
     * Return an array with the range between min & max, useful for pagination
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */
    DatagridPaginationController.prototype.range = function (min, max) {
        var input = [],
            i;

        for (i = min; i <= max; i++) {
            input.push(i);
        }

        return input;
    };

    DatagridPaginationController.prototype.nextPage = function () {
        var entityConfig = this.$scope.entityConfig;
        if (this.loadingPage || !this.infinitePagination || this.currentPage === this.nbPages) {
            return;
        }

        var self = this,
            searchParams = this.$location.search(),
            sortField = 'sortField' in searchParams ? searchParams.sortField : '',
            sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.loadingPage = true;
        this.currentPage++;

        self.progress.start();
        this.CrudManager.getAll(entityConfig.name(), this.currentPage, null, true, null, sortField, sortDir).then(function(nextData) {
            self.progress.done();

            self.$scope.entities = self.$scope.entities.concat(nextData.entities);
            self.loadingPage = false;
        });
    };

    /**
     * Link to page number of the list
     *
     * @param {int} number
     */
    DatagridPaginationController.prototype.setPage = function (number) {
        if (number <= 0 || number > this.nbPages) {
            return;
        }

        this.$location.search('page', number);
        this.$anchorScroll(0);
    };


    DatagridPaginationController.$inject = ['$scope', '$location', '$anchorScroll', 'CrudManager', 'progress'];

    return DatagridPaginationController;
});
