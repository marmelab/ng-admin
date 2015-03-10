/*global define*/

define(function () {
    'use strict';

    var SidebarController = function ($scope, $location, $sce, $filter, Configuration) {
        this.$scope = $scope;
        this.$location = $location;
        this.$sce = $sce;
        this.$filter = $filter;
        var menuViews = Configuration().getViewsOfType('MenuView');
        menuViews = this.$filter('enabled')(menuViews);
        menuViews = this.$filter('orderElement')(menuViews);
        this.entities = menuViews.map(function(menuView) {
            return menuView.getEntity();
        });
        this.computeCurrentEntity();
        $scope.$on('$locationChangeSuccess', this.computeCurrentEntity.bind(this));
        $scope.$on('$destroy', this.destroy.bind(this));
    };

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
        this.$location.search('search', null);
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
        this.$sce = undefined;
        this.$filter = undefined;
    };

    SidebarController.$inject = ['$scope', '$location', '$sce', '$filter', 'NgAdminConfiguration'];

    return SidebarController;
});
