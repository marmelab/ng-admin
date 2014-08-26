define([], function() {
    'use strict';

    function DashboardController($scope, $location, PanelBuilder) {
        this.$scope = $scope;
        this.$location = $location;
        this.PanelBuilder = PanelBuilder;
        this.getPanels();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    DashboardController.prototype.getPanels = function() {
        var self = this;

        this.PanelBuilder.getPanelsData().then(function(panels) {

            self.$scope.panels = {};

            angular.forEach(panels, function(panel) {

                var entityConfig = panel.entityConfig,
                    rawItems = panel.rawItems,
                    columns = [],
                    identifierField = 'id';

                // Get identifier field, and build columns array (only field defined with `"list" : true` in config file)
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

                self.$scope.panels[panel.entityName] = {
                    label: panel.entityConfig.label(),
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
