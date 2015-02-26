/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $stateParams, $filter, $location, $anchorScroll, RetrieveQueries, progression, view, data) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.RetrieveQueries = RetrieveQueries;
        this.progression = progression;
        this.view = view;
        this.entity = view.getEntity();
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.loadingPage = false;
        this.filters = this.$filter('orderElement')(view.filters());
        this.hasFilters = Object.keys(this.filters).length > 0;
        this.entries = data.entries;
        this.fields = this.$filter('orderElement')(view.fields());
        this.listActions = view.listActions();
        this.totalItems = data.totalItems;
        this.page = $stateParams.page || 1;
        this.infinitePagination = this.view.infinitePagination();
        this.nextPageCallback = this.nextPage.bind(this);
        this.setPageCallback = this.setPage.bind(this);

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.nextPage = function (page) {
        if (this.loadingPage) {
            return;
        }

        var progression = this.progression,
            self = this,
            filters = this.$stateParams.search,
            sortField = this.$stateParams.sortField,
            sortDir = this.$stateParams.sortDir;

        progression.start();

        this.RetrieveQueries
            .getAll(this.view, page, true, filters, sortField, sortDir)
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
        this.$filter = undefined;
        this.$location = undefined;
        this.$anchorScroll = undefined;
    };

    ListController.$inject = ['$scope', '$stateParams', '$filter', '$location', '$anchorScroll', 'RetrieveQueries', 'progression', 'view', 'data'];

    return ListController;
});
