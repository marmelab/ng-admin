/*global define*/

define(function () {
    'use strict';

    var ListLayoutController = function ($scope, $stateParams, $location, $timeout, view, dataStore) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.view = view;
        this.dataStore = dataStore;
        this.entity = view.getEntity();
        this.actions = view.actions();
        this.batchActions = view.batchActions();
        this.loadingPage = false;
        this.search = $location.search().search ? JSON.parse($location.search().search) : {};
        this.filters = view.filters();
        this.enabledFilters = this.filters.filter(filter => this.search && (filter.name() in this.search));
        this.hasFilters = Object.keys(this.filters).length > 0;
        this.focusedFilterId = null;
        var self = this;
        this.focus = function(filter) {
            self.focusedFilterId = filter.name();
            $timeout(() => window.document.getElementById(self.focusedFilterId).focus(), 200);
        }
        if (this.batchActions.length) {
            // required in scope to communicate with listView
            $scope.selectionUpdater = selection => $scope.selection = selection;
            $scope.selection = [];
        }

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListLayoutController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$stateParams = undefined;
        this.$location = undefined;
        this.dataStore = undefined;
    };

    ListLayoutController.$inject = ['$scope', '$stateParams', '$location', '$timeout', 'view', 'dataStore'];

    return ListLayoutController;
});
