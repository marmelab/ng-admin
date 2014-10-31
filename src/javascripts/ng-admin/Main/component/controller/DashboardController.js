/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular');

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
        var self = this,
            panel;
        this.panels = {};

        this.PanelBuilder.getPanelsData().then(function (panels) {
            var i;

            for (i in panels) {
                panel = panels[i];

                var view = panel.view,
                    fields = view.getFields(),
                    field,
                    j,
                    entries = panel.entries,
                    columns = [];

                // Retrieve all DashboardView
                for (j in fields) {
                    field = fields[j];

                    columns.push({
                        field: field,
                        label: field.label()
                    });
                }

                self.panels[view.name()] = {
                    label: view.label(),
                    view: view,
                    columns: columns,
                    entries: entries
                };
            }

        });
    };

    /**
     * Link to edit entity page
     *
     * @param {View} view
     */
    DashboardController.prototype.edit = function (view) {
        this.$location.path('/edit/' + view.getEntity().name() + '/' + view.getIdentifier().value);
    };

    DashboardController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$location', 'PanelBuilder'];

    return DashboardController;
});
