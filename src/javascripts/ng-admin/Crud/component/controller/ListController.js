/*global define*/

define(function () {
    'use strict';

    var ListController = function ($scope, $location, $anchorScroll, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.data = data;
        this.$anchorScroll = $anchorScroll;
        this.view = this.data.view;
        this.title = this.view.title();
        this.description = this.view.description();
        this.displayFilterQuery = this.view.filterQuery() !== false;
        this.actions = this.view.actions();

        var searchParams = this.$location.search();

        this.$scope.filterQuery = 'q' in searchParams ? searchParams.q : '';
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entries = data.entries;
        this.$scope.view = this.view;
        this.$scope.totalItems = this.data.totalItems;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.clearParams = function () {
        this.$location.search('q', null);
        this.$location.search('page', null);
        this.$location.search('sortField', null);
        this.$location.search('sortDir', null);
    };

    /**
     * Link to edit entity page
     *
     * @param {ListView} entry
     */
    ListController.prototype.edit = function (entry) {
        this.clearParams();

        this.$location.path('/edit/' + entry.entityName + '/' + entry.identifierValue);
        this.$anchorScroll(0);
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

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data'];

    return ListController;
});
