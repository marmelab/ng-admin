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
        this.PanelBuilder = PanelBuilder;

        this.$scope.edit = this.edit.bind(this);

        this.retrievePanels();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.retrievePanels = function () {
        var self = this;
        this.panels = [];

        var searchParams = this.$state.params;
        var sortField = 'sortField' in searchParams ? searchParams.sortField : null;
        var sortDir = 'sortDir' in searchParams ? searchParams.sortDir : null;

        this.PanelBuilder.getPanelsData(sortField, sortDir).then(function (panels) {
            self.panels = panels;
        });
    };

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DashboardController.prototype.edit = function (entry) {
        this.$state.go(this.$state.get('edit'), {
            entity: entry.entityName,
            id: entry.identifierValue
        });
    };

    DashboardController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$state', 'PanelBuilder'];

    return DashboardController;
});
