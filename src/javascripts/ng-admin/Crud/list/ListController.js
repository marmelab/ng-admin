/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $location, RetrieveQueries, progression, view, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.view = view;
        this.data = data;
        this.entity = view.getEntity();
        this.title = view.title();
        this.description = view.description();
        this.progression = progression;
        this.RetrieveQueries = RetrieveQueries;
        this.actions = view.actions();
        this.loadingPage = false;
        this.filters = view.filters();
        this.hasFilters = Object.keys(this.filters).length > 0;
        this.entries = data.entries;
        this.fields = view.fields();
        this.listActions = view.listActions();
        this.totalItems = this.data.totalItems;
        this.itemsPerPage = view.perPage();
        this.infinitePagination = view.infinitePagination();
        this.nextPageCallback = this.nextPage.bind(this);

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.nextPage = function (page, sortField, sortDir) {
        if (this.loadingPage) {
            return;
        }

        var progression = this.progression,
            self = this,
            loadingPage = this.loadingPage;

        progression.start();

        this.RetrieveQueries
            .getAll(this.view, page, true, null, sortField, sortDir)
            .then(function (nextData) {
                progression.done();

                self.entries = self.entries.concat(nextData.entries);
                loadingPage = false;
            });
    };

    ListController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
    };

    ListController.$inject = ['$scope', '$location', 'RetrieveQueries', 'progression', 'view', 'data'];

    return ListController;
});
