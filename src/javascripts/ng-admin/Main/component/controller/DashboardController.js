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
        this.retrievePanels();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.retrievePanels = function () {
        var self = this;
        this.panels = [];

        this.PanelBuilder.getPanelsData().then(function (panels) {
            self.panels = panels
        });
    };

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DashboardController.prototype.edit = function (entry) {
        this.$location.path('/edit/' + entry.entityName + '/' + entry.identifierValue);
    };

    DashboardController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$location', 'PanelBuilder'];

    return DashboardController;
});
