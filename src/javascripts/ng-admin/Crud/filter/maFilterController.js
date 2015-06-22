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
    'use strict';

    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope.values = this.$scope.values() || {};
    $scope.$watch('values', (newValues, oldValues) => {
        if (newValues != oldValues) {
            this.filter(); // FIXME use debounce
        }
    }, true)
    this.$scope.filters = this.$scope.filters;
    this.$scope.datastore = this.$scope.datastore();
    this.isFilterEmpty = isEmpty(this.$scope.values);
}

function isEmpty(values) {
    for (var i in values) {
        if (values[i] != '') return false;
    }
    return true;
}

maFilterController.prototype.removeFilter = function(filter) {
    this.$scope.filters = this.$scope.filters.filter(f => f !== filter);
    if (filter.name() in this.$stateParams.search) {
        this.filter();
    }
};

maFilterController.prototype.filter = function () {
    var values = {},
        filters = this.$scope.filters,
        fieldName,
        field,
        i;

    for (i in filters) {
        field = filters[i];
        fieldName = field.name();

        if ((field.type() === 'boolean' && this.$scope.values[fieldName]) || // for boolean false is the same as null
            (field.type() !== 'boolean' && this.$scope.values[fieldName] !== null)) {
            values[fieldName] = this.$scope.values[fieldName];
        }
    }

    this.$stateParams.search = values;
    this.$stateParams.page = 1;
    this.$state.go('list', this.$stateParams);
};

maFilterController.prototype.shouldFilter = function () {
    return Object.keys(this.$scope.filters).length;
};

maFilterController.prototype.destroy = function () {
    this.$scope = undefined;
};

maFilterController.$inject = ['$scope', '$state', '$stateParams'];

module.exports = maFilterController;
