/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $stateParams, $location, $anchorScroll, ReadQueries, progression, view, dataStore, totalItems) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.ReadQueries = ReadQueries;
        this.progression = progression;
        this.view = view;
        this.entity = view.getEntity();
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.batchActions = view.batchActions();
        this.loadingPage = false;
        this.filters = view.filters();
        this.hasFilters = Object.keys(this.filters).length > 0;
        this.dataStore = dataStore;
        this.fields = view.fields();
        this.listActions = view.listActions();
        this.totalItems = totalItems;
        this.page = $stateParams.page || 1;
        this.infinitePagination = this.view.infinitePagination();
        this.nextPageCallback = this.nextPage.bind(this);
        this.setPageCallback = this.setPage.bind(this);
        this.selection = this.batchActions.length ? [] : null;
        this.sortField = this.$stateParams.sortField || this.view.getSortFieldName();
        this.sortDir = this.$stateParams.sortDir || this.view.sortDir();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.nextPage = function (page) {
        if (this.loadingPage) {
            return;
        }

        var progression = this.progression,
            self = this,
            filters = this.$stateParams.search;

        progression.start();

        this.ReadQueries
            .getAll(this.view, page, true, filters, this.sortField, this.sortDir)
            .then(function (nextData) {
                progression.done();
                self.entries = self.entries.concat(nextData.entries);
                self.loadingPage = false;
            });
    };

    ListController.prototype.setPage = function (number) {
        this.$location.search('page', number);
        this.$anchorScroll(0);
    };


    ListController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$stateParams = undefined;
        this.$location = undefined;
        this.$anchorScroll = undefined;
        this.dataStore = undefined;
    };

    ListController.$inject = ['$scope', '$stateParams', '$location', '$anchorScroll', 'ReadQueries', 'progression', 'view', 'dataStore', 'totalItems'];

    return ListController;
});
