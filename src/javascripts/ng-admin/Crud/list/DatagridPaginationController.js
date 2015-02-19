/*global define*/

define(function () {
    'use strict';

    var angular = require('angular');

    function DatagridPaginationController($scope, $location, $anchorScroll, $window, $document) {
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
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
        var perPage = this.$scope.perPage,
            currentPage = this.$location.search().page || 1,
            totalItems = this.$scope.totalItems;

        this.currentPage = currentPage;
        this.offsetEnd = Math.min(currentPage * perPage, totalItems);
        this.offsetBegin = Math.min((currentPage - 1) * perPage + 1, this.offsetEnd);
        this.totalItems = totalItems;
        this.nbPages = Math.ceil(totalItems / (perPage || 1)) || 1;
        this.displayPagination = perPage < totalItems;
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
        if (!this.$scope.infinite || this.currentPage >= this.nbPages) {
            return;
        }
        this.currentPage++;
        this.$scope.nextPage(this.currentPage);
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

    DatagridPaginationController.prototype.destroy = function() {
        if (this.handler) {
            this.windowElement.unbind('scroll', this.handler);
        }
        this.$scope = undefined;
        this.$location = undefined;
        this.$anchorScroll = undefined;
        this.windowElement = undefined;
    };

    DatagridPaginationController.$inject = ['$scope', '$location', '$anchorScroll', '$window', '$document'];

    return DatagridPaginationController;
});
