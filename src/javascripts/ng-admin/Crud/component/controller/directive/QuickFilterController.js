/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     * @constructor
     */
    function QuickFilterController($scope, $location) {
        this.$scope = $scope;
        this.$location = $location;

        var searchParams = this.$location.search();
        this.quickFilters = this.$scope.view.getQuickFilterNames();
        this.currentQuickFilter = 'quickFilter' in searchParams ? searchParams.quickFilter : null;
        this.displayFilterQuery = this.$scope.view.filterQuery() !== false;
    }

    QuickFilterController.prototype.filter = function (label) {
        this.$location.search('quickFilter', label);
    };

    QuickFilterController.$inject = ['$scope', '$location'];

    return QuickFilterController;
});
