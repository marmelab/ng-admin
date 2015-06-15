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
    function DashboardController($scope, $state, PanelBuilder) {
        this.$scope = $scope;
        this.$state = $state;

        this.retrieveCollections(PanelBuilder);

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.retrieveCollections = function (PanelBuilder) {
        this.collections = {};
        this.orderedCollections = [];

        var searchParams = this.$state.params;
        var sortField = 'sortField' in searchParams ? searchParams.sortField : null;
        var sortDir = 'sortDir' in searchParams ? searchParams.sortDir : null;

        PanelBuilder.getPanelsData(sortField, sortDir).then(collections => {
            this.collections = collections;
            let orderedCollections = [];
            for (var name in collections) {
                orderedCollections.push(collections[name]);
            }
            this.orderedCollections = orderedCollections.sort((collectionA, collectionB) => {
                return collectionA.order - collectionB.order;
            });
        });
        this.hasEntities = PanelBuilder.hasEntities();
    };

    DashboardController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
    };

    DashboardController.$inject = ['$scope', '$state', 'PanelBuilder'];

    return DashboardController;
});
