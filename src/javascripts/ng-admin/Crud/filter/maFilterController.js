/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}        $scope
     * @param {$state}        $state
     * @param {$stateParams}  $stateParams
     * @param {Configuration} Configuration
     *
     * @constructor
     */
    function maFilterController($scope, $state, $stateParams) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$scope.values = this.$stateParams.search || {};
        this.$scope.filters = this.$scope.filters();
        this.$scope.datastore = this.$scope.datastore();
        this.isFilterEmpty = isEmpty(this.$scope.values);
    }

    function isEmpty(values) {
        for (var i in values) {
            if (values[i] != '') return false;
        }
        return true;
    }

    maFilterController.prototype.filter = function () {
        var values = {},
            filters = this.$scope.filters,
            fieldName,
            field,
            i;

        for (i in filters) {
            field = filters[i];
            fieldName = field.name();

            if (this.$scope.values[fieldName] !== null) {
                values[fieldName] = this.$scope.values[fieldName];
            }
        }

        this.$stateParams.search = values;
        this.$stateParams.page = 1;
        this.$state.go(this.$state.current, this.$stateParams, { reload: true, inherit: false, notify: true });
    };

    maFilterController.prototype.shouldFilter = function () {
        return Object.keys(this.$scope.filters).length;
    };

    maFilterController.prototype.clearFilters = function () {
        var i;

        for (i in this.$scope.values) {
            this.$scope.values[i] = null;
        }

        this.filter();
    };

    maFilterController.prototype.destroy = function () {
        this.$scope = undefined;
    };

    maFilterController.$inject = ['$scope', '$state', '$stateParams'];

    return maFilterController;
});
