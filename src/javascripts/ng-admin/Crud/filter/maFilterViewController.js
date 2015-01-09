/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope}        $scope
     * @param {$state}        $state
     * @param {$stateParams}  $stateParams
     * @param {$filter}       $filter
     * @param {Configuration} Configuration
     *
     * @constructor
     */
    function FilterViewController($scope, $state, $stateParams, $filter, Configuration) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.values = this.$stateParams.search || {};
        this.view = Configuration().getViewByEntityAndType($stateParams.entity, 'FilterView');
        this.$scope.fields = this.$scope.filterFields();
        this.isFilterEmpty = isEmpty(this.values);
    }

    function isEmpty(values) {
        for (i in values) {
            if (values[i] != '') return false;
        }
        return true;
    }

    FilterViewController.prototype.filter = function () {
        var values = {},
            fields = this.view.getFields(),
            fieldName,
            field,
            i;

        for (i in fields) {
            field = fields[i];
            fieldName = field.name();

            if (this.values[fieldName]) {
                values[fieldName] = this.values[fieldName];

                if (field.type() === 'date') {
                    values[fieldName] = this.$filter('date')(values[fieldName], field.format());
                }
            }
        }

        this.$stateParams.search = values;
        this.$state.go(this.$state.current, this.$stateParams, { reload: true, inherit: false, notify: true });
    };

    FilterViewController.prototype.shouldFilter = function () {
        return Object.keys(this.$scope.fields).length;
    };

    FilterViewController.prototype.clearFilters = function () {
        var i;

        for (i in this.values) {
            this.values[i] = null;
        }

        this.filter();
    };

    FilterViewController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'NgAdminConfiguration'];

    return FilterViewController;
});
