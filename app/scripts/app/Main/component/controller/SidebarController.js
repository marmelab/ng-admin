define([
    'config'
], function(config) {
    'use strict';

    var SidebarController = function($scope, $location) {
        this.$scope = $scope;
        this.$location = $location;

        this.entities = config.getEntities();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    SidebarController.prototype.displayList = function(entity) {
        this.$location.path('/list/' + entity);
    };

    SidebarController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
    };

    SidebarController.$inject = ['$scope', '$location'];

    return SidebarController;
});
