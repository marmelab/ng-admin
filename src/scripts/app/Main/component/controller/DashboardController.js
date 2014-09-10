define([], function() {
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
        this.getPanels();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    /**
     * Retrieve all dashboard panels
     */
    DashboardController.prototype.getPanels = function() {
        var self = this;
        this.panels = {};

        this.PanelBuilder.getPanelsData().then(function(panels) {
            angular.forEach(panels, function(panel) {

                var entityConfig = panel.entityConfig,
                    rawItems = panel.rawItems,
                    columns = [],
                    identifierField = 'id';

                // Get identifier field, and build columns array (only field defined with `list(true)` in config file)
                angular.forEach(entityConfig.getFields(), function(field) {
                    if(!field.dashboard()) {
                        return;
                    }

                    if(field.identifier()) {
                        identifierField = field.getName();
                    }

                    columns.push({
                        field: field.getName(),
                        label: field.label()
                    });
                });

                self.panels[panel.entityName] = {
                    label: panel.entityConfig.label(),
                    entity: entityConfig,
                    columns: columns,
                    items: rawItems,
                    identifierField: identifierField,
                    options: {
                        grid : {
                            dimensions : [ columns.length, rawItems.length ]
                        }
                    }
                };
            });

        });
    };

    /**
     * Redirect to the entity edition form
     *
     * @param {String} entityName
     * @param {Number} identifier
     * @param {Entity} item
     */
    DashboardController.prototype.edit = function(entityName, identifier, item) {
        this.$location.path('/edit/' + entityName + '/' + item[identifier]);
    };

    DashboardController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.PanelBuilder = undefined;
    };

    DashboardController.$inject = ['$scope', '$location', 'PanelBuilder'];

    return DashboardController;
});
