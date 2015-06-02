/*global define*/

define(function (require) {
    'use strict';

    /**
     *
     * @param {$scope}       $scope
     * @param {$location}    $location
     * @param {PanelBuilder} PanelBuilder
     * @constructor
     */
    function DashboardController($scope, $location, PanelBuilder) {
        this.$scope = $scope;
        this.$location = $location;
        this.PanelBuilder = PanelBuilder;

        this.$scope.edit = this.edit.bind(this);

        var searchParams = this.$location.search();
        this.sortField = 'sortField' in searchParams ? searchParams.sortField : null;
        this.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : null;

        this.retrievePanels();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.retrievePanels = function () {
        var self = this;
        this.panels = [];

        this.PanelBuilder.getPanelsData(this.sortField, this.sortDir).then(function (panels) {
            self.panels = panels;
        });
        this.hasEntities = this.PanelBuilder.hasEntities();
    };

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DashboardController.prototype.edit = function (entry) {
        this.$location.path(entry.entityName + '/edit/' + entry.identifierValue);
    };

    DashboardController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$location', 'PanelBuilder'];

    return DashboardController;
});
