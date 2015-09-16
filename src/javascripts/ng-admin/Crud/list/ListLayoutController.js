var ListLayoutController = function ($scope, $stateParams, $state, $location, $timeout, view, dataStore) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.view = view;
    this.dataStore = dataStore;
    this.entity = view.getEntity();
    this.actions = view.actions();
    this.batchActions = view.batchActions();
    this.loadingPage = false;
    this.search = $location.search().search ? JSON.parse($location.search().search) : {};
    // since search isn't a $stateParam of the listLayout state,
    // the controller doesn't change when the search changes
    // so we must update filter values manually when the location changes
    $scope.$watch(
        () => $location.search() && $location.search().search ,
        (newval, oldval) => {
            if (newval === oldval) return;
            this.search = $location.search().search ? JSON.parse($location.search().search) : {};
            this.enabledFilters = this.getEnabledFilters();
        }
    );
    // apply filters when filter values change
    $scope.$watch(
        () => this.search,
        _.debounce((newValues, oldValues) => {
            if (newValues != oldValues) {
                this.updateFilters();
            }
        }, 500),
        true
    );
    this.filters = view.filters();
    this.enabledFilters = this.getEnabledFilters();
    this.hasFilters = Object.keys(this.filters).length > 0;
    this.focusedFilterId = null;
    this.enableFilter = this.enableFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    if (this.batchActions.length) {
        // required in scope to communicate with listView
        $scope.selectionUpdater = selection => $scope.selection = selection;
        $scope.selection = [];
    }

    $scope.$on('$destroy', this.destroy.bind(this));
};

ListLayoutController.prototype.enableFilter = function (filter) {
    let defaultValue = filter.defaultValue();
    if (defaultValue !== null) {
        this.search[filter.name()] = defaultValue;
    }
    this.enabledFilters.push(filter)
    this.focusedFilterId = filter.name();
    this.$timeout(() => {
        let el = window.document.getElementById(this.focusedFilterId);
        el && el.focus && el.focus();
    }, 200, false);
}

ListLayoutController.prototype.getEnabledFilters = function () {
    return this.filters.filter(filter => {
        if (filter.pinned()) return true;
        return this.search && (filter.name() in this.search)
    });
}

ListLayoutController.prototype.updateFilters = function () {
    var values = {},
        filters = this.enabledFilters,
        fieldName,
        field,
        i;
    for (i in filters) {
        field = filters[i];
        fieldName = field.name();
        if (this.search[fieldName] === '') {
            delete this.search[fieldName];
            continue;
        }

        if ((field.type() === 'boolean' && this.search[fieldName]) || // for boolean false is the same as null
            (field.type() !== 'boolean' && this.search[fieldName] !== null)) {
            values[fieldName] = this.search[fieldName];
        }
    }
    this.$stateParams.search = values;
    this.$stateParams.page = 1;
    this.$state.go('list', this.$stateParams);
};

ListLayoutController.prototype.removeFilter = function(filter) {
    delete this.search[filter.name()];
    this.enabledFilters = this.enabledFilters.filter(f => f !== filter);
};

ListLayoutController.prototype.destroy = function () {
    this.$scope = undefined;
    this.$state = undefined;
    this.$stateParams = undefined;
    this.$timeout = undefined;
    this.dataStore = undefined;
};

ListLayoutController.$inject = ['$scope', '$stateParams', '$state', '$location', '$timeout', 'view', 'dataStore'];

module.exports = ListLayoutController;
