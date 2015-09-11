/*global define*/

define(function (require) {
    'use strict';

    /**
     *
     * @param {$scope}       $scope
     * @param {$state}    $state
     * @param {PanelBuilder} PanelBuilder
     * @constructor
     */
    function DashboardController($scope, $state, collections, entries, hasEntities, dataStore) {
        this.$state = $state;
        this.collections = collections;
        this.entries = entries;
        this.hasEntities = hasEntities;
        this.datastore = dataStore;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    DashboardController.prototype.gotoList = function(entityName) {
        this.$state.go(this.$state.get('list'), { entity: entityName });
    }

    DashboardController.prototype.destroy = function () {
        this.$state = undefined;
    };

    DashboardController.$inject = ['$scope', '$state', 'collections', 'entries', 'hasEntities', 'dataStore'];

    return DashboardController;
});
