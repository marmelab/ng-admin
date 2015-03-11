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
        this.$scope = $scope;
        this.$location = $location;
        this.applicationName = Configuration().title();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    AppController.prototype.displayHome = function () {
        this.$location.path('dashboard');
    };

    AppController.prototype.destroy = function () {
        this.$scope = undefined;
    };

    AppController.$inject = ['$scope', '$location', 'NgAdminConfiguration'];

    return AppController;
});
