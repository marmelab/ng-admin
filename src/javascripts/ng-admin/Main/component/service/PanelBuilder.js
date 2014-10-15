define(function() {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {ListViewRepository} ListViewRepository
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, ListViewRepository, Configuration) {
        this.$q = $q;
        this.ListViewRepository = ListViewRepository;
        this.Configuration = Configuration();
    }

    /**
     * Returns all elements of each dashboard panels
     *
     * @returns {promise}
     */
    PanelBuilder.prototype.getPanelsData = function() {
        var dashboards = this.Configuration.getViewsOfType('DashboardView'),
            promises = [],
            self = this;

        angular.forEach(dashboards, function(dashboardView) {
            promises.push(self.ListViewRepository.getAll(dashboardView));
        });

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', 'ListViewRepository', 'NgAdminConfiguration'];

    return PanelBuilder;
});
