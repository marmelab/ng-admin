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
    var AppController = function ($scope, $state, configuration) {
        this.$scope = $scope;
        this.$state = $state;
        this.menu = configuration.menu();
        this.applicationName = configuration.title();
        this.header = configuration.header();

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
