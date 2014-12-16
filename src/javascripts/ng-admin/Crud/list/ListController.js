/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $location, RetrieveQueries, progression, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.data = data;
        this.view = this.data.view;
        this.title = this.view.title();
        this.description = this.view.description();
        this.progression = progression;
        this.RetrieveQueries = RetrieveQueries;
        this.displayFilterQuery = this.view.filterQuery() !== false;
        this.actions = this.view.actions();
        this.loadingPage = false;

        var searchParams = this.$location.search();

        this.$scope.filterQuery = 'q' in searchParams ? searchParams.q : '';
        this.entries = data.entries;
        this.fields = this.view.displayedFields;
        this.listActions = this.view.listActions();
        this.entity = this.view.getEntity();
        this.quickFilters = this.view.getQuickFilterNames();
        this.totalItems = this.data.totalItems;
        this.itemsPerPage = this.view.perPage();
        this.infinitePagination = this.view.infinitePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.clearFilter = function () {
        this.$scope.filterQuery = '';
        this.filter();
    };

    ListController.prototype.filter = function () {
        this.$location.search('q', this.$scope.filterQuery);
    };

    ListController.prototype.nextPage = function (page, sortField, sortDir) {
        if (this.loadingPage) {
            return;
        }

        var progression = this.progression,
            $scope = this.$scope,
            loadingPage = this.loadingPage;

        progression.start();

        this.RetrieveQueries
            .getAll(this.view, page, true, null, sortField, sortDir)
            .then(function (nextData) {
                progression.done();

                $scope.entries = $scope.entries.concat(nextData.entries);
                loadingPage = false;
            });
    };

    ListController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
    };

    ListController.$inject = ['$scope', '$location', 'RetrieveQueries', 'progression', 'data'];

    return ListController;
});
