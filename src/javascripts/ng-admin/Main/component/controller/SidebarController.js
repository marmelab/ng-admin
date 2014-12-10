/*global define*/

define(function () {
    'use strict';

    var SidebarController = function ($scope, $location, $sce, Configuration) {
        this.$scope = $scope;
        this.$location = $location;
        this.$sce = $sce;
        this.entities = getEntities(Configuration);
        this.computeCurrentEntity();
        $scope.$on('$locationChangeSuccess', this.computeCurrentEntity.bind(this));
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    function getEntities(Configuration) {
        var entitiesWithOrder = [];
        var index = 0;
        angular.forEach(Configuration().getEntities(), function(entity) {
            if (!entity.menuView().isEnabled()) return;
            entitiesWithOrder.push({ entity: entity, order: entity.menuView().order() || index });
            index++;
        });
        entitiesWithOrder.sort(function (a, b) {
            return a.order - b.order;
        });
        var entities = [];
        angular.forEach(entitiesWithOrder, function(entity) {
            entities.push(entity.entity);
        });
        return entities;
    }

    /**
     * Inject the current entity in the controller
     */
    SidebarController.prototype.computeCurrentEntity = function () {
        var location = this.$location.url().split('?')[0],
            urlParts = location.split('/');

        this.currentEntity = urlParts && urlParts.length > 2 ? urlParts[2] : null;
    };

    SidebarController.prototype.displayList = function (entity) {
        this.$location.search('q', null);
        this.$location.search('page', 1);
        this.$location.search('sortField', null);
        this.$location.search('sortOrder', null);
        this.$location.search('quickFilters', null);
        this.$location.path('/list/' + entity.name());
    };

    SidebarController.prototype.isActive = function (entity) {
        return this.currentEntity === entity.name();
    };

    SidebarController.prototype.getIconForEntity = function(entity) {
        return this.$sce.trustAsHtml(entity.menuView().icon());
    };

    SidebarController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
    };

    SidebarController.$inject = ['$scope', '$location', '$sce', 'NgAdminConfiguration'];

    return SidebarController;
});
