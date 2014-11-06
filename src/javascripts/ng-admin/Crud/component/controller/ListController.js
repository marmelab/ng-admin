define(function(require) {
    'use strict';

    var ListController = function($scope, $location, $anchorScroll, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.data = data;
        this.$anchorScroll = $anchorScroll;
        this.entityConfig = this.data.entityConfig;
        this.entityLabel = data.entityConfig.label();
        this.title = data.entityConfig.getListTitle();
        this.description = data.entityConfig.getDescription();
        this.displayFilterQuery = data.entityConfig.filterQuery() !== false;

        var searchParams = this.$location.search();

        this.$scope.filterQuery = 'q' in searchParams ? searchParams.q : '';
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entities = data.entities;
        this.$scope.entityConfig = this.entityConfig;
        this.$scope.totalItems = this.data.totalItems;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.clearParams = function() {
        this.$location.search('q', null);
        this.$location.search('page', null);
        this.$location.search('sortField', null);
        this.$location.search('sortDir', null);
    };

    /**
     * Link to entity creation page
     */
    ListController.prototype.create = function() {
        this.clearParams();

        this.$location.path('/create/' + this.data.entityName);
        this.$anchorScroll(0);
    };

    /**
     * Link to edit entity page
     *
     * @param {Entity} entity
     */
    ListController.prototype.edit = function(entity) {
        this.clearParams();

        this.$location.path('/edit/' + entity.name() + '/' + entity.getIdentifier().value);
        this.$anchorScroll(0);
    };

    ListController.prototype.clearFilter = function() {
        this.$scope.filterQuery = '';
        this.filter();
    };

    ListController.prototype.filter = function() {
        this.$location.search('q', this.$scope.filterQuery);
    };

    ListController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
    };

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data'];

    return ListController;
});
