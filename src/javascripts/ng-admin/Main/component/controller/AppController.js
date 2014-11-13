/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}               $scope
     * @param {NgAdminConfiguration} Configuration
     * @constructor
     */
    var AppController = function ($scope, Configuration) {
        this.$scope = $scope;
        this.applicationName = Configuration().title();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    AppController.prototype.destroy = function () {
        this.$scope = undefined;
    };

    AppController.$inject = ['$scope', 'NgAdminConfiguration'];

    return AppController;
});
