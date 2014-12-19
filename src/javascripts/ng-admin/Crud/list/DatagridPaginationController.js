/*global define*/

define(function () {
    'use strict';

    function DatagridPaginationController($scope, $location, $anchorScroll) {
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
    }

    DatagridPaginationController.prototype.computePagination = function () {
        var perPage = this.$scope.perPage,
            currentPage = this.$location.search().page || 1,
            totalItems = this.$scope.totalItems;

        this.infinitePagination = this.$scope.hasPagination && this.$scope.infinitePagination;
        this.currentPage = currentPage;
        this.offsetEnd = Math.min(currentPage * perPage, totalItems);
        this.offsetBegin = Math.min((currentPage - 1) * perPage + 1, this.offsetEnd);

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
        if (!this.infinitePagination || this.currentPage === this.nbPages) {
            return;
        }

        var searchParams = this.$location.search(),
            sortField = 'sortField' in searchParams ? searchParams.sortField : '',
            sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.currentPage++;

        this.$scope.nextPage(this.currentPage, sortField, sortDir);
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

    DatagridPaginationController.$inject = ['$scope', '$location', '$anchorScroll'];

    return DatagridPaginationController;
});
