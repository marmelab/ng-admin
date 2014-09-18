define([], function() {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @constructor
     */
    var AppController = function ($scope, Configuration) {
        this.$scope = $scope;
        this.applicationName = '';//Configuration.title();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    AppController.prototype.destroy = function() {
        this.$scope = undefined;
    };

    AppController.$inject = ['$scope', 'Configuration'];

    return AppController;
});
