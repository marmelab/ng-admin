/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}               $scope
     * @param {$state}            $state
     * @param {NgAdmin} Configuration
     * @constructor
     */
    var AppController = function ($scope, $state, Configuration) {
        var application = Configuration();
        this.$scope = $scope;
        this.$state = $state;
        this.$scope.isCollapsed = true;
        this.menu = application.menu();
        this.applicationName = application.title();
        this.header = application.header();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    AppController.prototype.displayHome = function () {
        this.$state.go(this.$state.get('dashboard'));
    };

    AppController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
    };

    AppController.$inject = ['$scope', '$state', 'NgAdminConfiguration'];

    return AppController;
});
