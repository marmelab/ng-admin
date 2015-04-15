/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}               $scope
     * @param {$location}            $location
     * @param {NgAdmin} Configuration
     * @constructor
     */
    var AppController = function ($scope, $location, Configuration) {
        var application = Configuration();
        this.$scope = $scope;
        this.$location = $location;
        this.menu = application.menu();
        this.applicationName = application.title();
        this.header = application.header();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    AppController.prototype.displayHome = function () {
        this.$location.path('dashboard');
    };

    AppController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
    };

    AppController.$inject = ['$scope', '$location', 'NgAdminConfiguration'];

    return AppController;
});
