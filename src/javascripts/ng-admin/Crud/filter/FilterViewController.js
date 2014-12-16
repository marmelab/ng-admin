/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     *
     * @constructor
     */
    function FilterViewController($scope, $location) {
        this.$scope = $scope;
        this.$location = $location;
    }

    FilterViewController.prototype.filter = function ($event, form) {
        $event.preventDefault();
    };

    FilterViewController.$inject = ['$scope', '$location'];

    return FilterViewController;
});
