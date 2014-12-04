/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $location, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.data = data;
        this.view = this.data.view;
        this.title = this.view.title();
        this.description = this.view.description();
        this.displayFilterQuery = this.view.filterQuery() !== false;
        this.actions = this.view.actions();

        var searchParams = this.$location.search();

        this.$scope.filterQuery = 'q' in searchParams ? searchParams.q : '';
        this.$scope.entries = data.entries;
        this.$scope.view = this.view;
        this.$scope.totalItems = this.data.totalItems;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.clearFilter = function () {
        this.$scope.filterQuery = '';
        this.filter();
    };

    ListController.prototype.filter = function () {
        this.$location.search('q', this.$scope.filterQuery);
    };

    ListController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
    };

    ListController.$inject = ['$scope', '$location', 'data'];

    return ListController;
});
