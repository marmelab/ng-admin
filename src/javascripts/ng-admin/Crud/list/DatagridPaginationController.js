/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular');

    function DatagridPaginationController($scope, $window, $document) {
        this.$scope = $scope;
        this.windowElement = angular.element($window);

        if ($scope.infinite) {
            var offset = 100,
                body = $document[0].body,
                nextPage = this.nextPage.bind(this);
            this.handler = function () {
                if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
                    nextPage();
                }
            };
            this.windowElement.bind('scroll', this.handler);
            this.infinite = true;
        }

        this.computePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    DatagridPaginationController.prototype.computePagination = function () {
        var perPage = parseInt(this.$scope.perPage, 10) || 1,
            totalItems = parseInt(this.$scope.totalItems, 10),
            page = Math.max(parseInt(this.$scope.page, 10), 1);

        this.nbPages = Math.ceil(totalItems / perPage) || 1;
        this.page = Math.min(this.nbPages, page);
        this.offsetEnd = Math.min(this.page * perPage, totalItems);
        this.offsetBegin = Math.min((this.page - 1) * perPage + 1, this.offsetEnd);
        this.totalItems = totalItems;
        this.displayPagination = perPage < totalItems;
    };

    /**
     * Return an array with the range between min & max, useful for pagination
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */
    DatagridPaginationController.prototype.range = function (page) {
        var input = [],
            nbPages = this.nbPages;

        // display page links around the current page
        if (page > 3) {
            input.push('1');
        }
        if (page > 4) {
            input.push('.');
        }
        if (page > 2) {
            input.push(page - 2);
        }
        if (page > 1) {
            input.push(page - 1);
        }
        input.push(page);
        if (page < nbPages) {
            input.push(page + 1);
        }
        if (page < (nbPages - 1)) {
            input.push(page + 2);
        }
        if (page < (nbPages - 3)) {
            input.push('.');
        }
        if (page < (nbPages - 2)) {
            input.push(nbPages);
        }

        return input;
    };

    DatagridPaginationController.prototype.nextPage = function () {
        if (!this.$scope.infinite || this.page >= this.nbPages) {
            return;
        }
        this.page++;
        this.$scope.nextPage()(this.page);
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
        this.$scope.setPage()(number);
    };

    DatagridPaginationController.prototype.destroy = function() {
        if (this.handler) {
            this.windowElement.unbind('scroll', this.handler);
        }
        this.$scope = undefined;
        this.windowElement = undefined;
    };

    DatagridPaginationController.$inject = ['$scope', '$window', '$document'];

    return DatagridPaginationController;
});
