/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}    $scope
     * @param {$location} $location
     * @param {$window}   $window
     *
     * @constructor
     */
    function FilterViewController($scope, $location, $window) {
        this.$scope = $scope;
        this.$location = $location;
        this.$window = $window;
        this.values = {};

        var searchParams = this.$location.search(),
            filters = this.$scope.filterFields(),
            paramName,
            i;

        for (i in filters) {
            paramName = this.getParamName(i);

            this.values[i] = paramName in searchParams ? searchParams[paramName] : null;
        }
    }

    FilterViewController.prototype.filter = function () {
        var i;

        for (i in this.values) {
            this.$location.search(this.getParamName(i), this.values[i]);
        }

        this.$window.location.reload();
    };

    FilterViewController.prototype.clearFilters = function () {
        var i;

        for (i in this.values) {
            this.values[i] = null;
        }

        this.filter();
    };

    FilterViewController.prototype.getParamName = function (fieldName) {
        return 'search[' + fieldName + ']';
    };

    FilterViewController.$inject = ['$scope', '$location', '$window'];

    return FilterViewController;
});
