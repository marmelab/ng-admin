define(function() {
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
    DashboardController.prototype.retrievePanels = function() {
        var self = this;
        this.panels = {};

        this.PanelBuilder.getPanelsData().then(function(panels) {
            angular.forEach(panels, function(panel) {

                var entityConfig = panel.entityConfig,
                    entities = panel.entities,
                    columns = [];

                // Retrieve all DashboardView
                angular.forEach(entityConfig.getFields(), function(field) {
                    if(!field.dashboard()) {
                        return;
                    }

                    columns.push({
                        field: field,
                        label: field.label()
                    });
                });

                self.panels[panel.entityName] = {
                    label: panel.entityConfig.label(),
                    entity: entityConfig,
                    columns: columns,
                    entities: entities,
                    options: {
                        grid : {
                            dimensions : [ columns.length, entities.length ]
                        }
                    }
                };
            });

        });
    };

    /**
     * Link to edit entity page
     *
     * @param {Entity} entity
     */
    DashboardController.prototype.edit = function(entity) {
        this.$location.path('/edit/' + entity.name() + '/' + entity.getIdentifier().value);
    };

    DashboardController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$location', 'PanelBuilder'];

    return DashboardController;
});
