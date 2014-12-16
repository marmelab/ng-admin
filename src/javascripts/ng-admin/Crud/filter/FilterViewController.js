/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}       $scope
     * @param {$state}       $state
     * @param {$stateParams} $stateParams
     *
     * @constructor
     */
    function FilterViewController($scope, $state, $stateParams) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.values = {};

        this.values = this.$stateParams.search;
    }

    FilterViewController.prototype.filter = function () {
        var values = {},
            i;

        for (i in this.values) {
            if (this.values[i]) {
                values[i] = this.values[i];
            }
        }

        this.$stateParams.search = values;
        this.$state.go(this.$state.current, this.$stateParams, { reload: true, inherit: false, notify: true });
    };

    FilterViewController.prototype.clearFilters = function () {
        var i;

        for (i in this.values) {
            this.values[i] = null;
        }

        this.filter();
    };

    FilterViewController.$inject = ['$scope', '$state', '$stateParams'];

    return FilterViewController;
});
