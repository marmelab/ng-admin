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

        this.retrieveCollectionsAndData(PanelBuilder);

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    DashboardController.prototype.gotoList = function(entityName) {
        this.$state.go(this.$state.get('list'), { entity: entityName });
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.retrieveCollectionsAndData = function (PanelBuilder) {
        let collections = PanelBuilder.getCollections();
        this.entries = {};

        var searchParams = this.$state.params;
        var sortField = 'sortField' in searchParams ? searchParams.sortField : null;
        var sortDir = 'sortDir' in searchParams ? searchParams.sortDir : null;

        PanelBuilder.getEntries(sortField, sortDir).then(entries => {
            this.entries = entries;
            this.collections = collections; // we set collectrions only when entries are fetched to avoid double draw
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
