/**
 * @param {$scope} $scope
 * @param {$state} $state
 * @param {PanelBuilder} PanelBuilder
 * @constructor
 */
export default class DashboardController {
    constructor($scope, $state, collections, entries, hasEntities, dataStore) {
        this.$state = $state;
        this.collections = collections;
        this.entries = entries;
        this.hasEntities = hasEntities;
        this.datastore = dataStore;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    gotoList(entityName) {
        this.$state.go(this.$state.get('list'), { entity: entityName });
    }

    destroy() {
        this.$state = undefined;
    }
}

DashboardController.$inject = ['$scope', '$state', 'collections', 'entries', 'hasEntities', 'dataStore'];
