/*global define*/

define(function () {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {$filter}            $filter
     * @param {ListViewRepository} ListViewRepository
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, $filter, ListViewRepository, Configuration) {
        this.$q = $q;
        this.$filter = $filter;
        this.ListViewRepository = ListViewRepository;
        this.Configuration = Configuration();
    }

    /**
     * Returns all elements of each dashboard panels
     *
     * @returns {promise}
     */
    PanelBuilder.prototype.getPanelsData = function () {
        var dashboards = this.Configuration.getViewsOfType('DashboardView'),
            promises = [],
            dashboardView,
            self = this,
            i;

        dashboards = this.$filter('orderElement')(dashboards);

        for (i in dashboards) {
            dashboardView = dashboards[i];

            promises.push(self.ListViewRepository.getAll(dashboardView));
        }

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', '$filter', 'ListViewRepository', 'NgAdminConfiguration'];

    return PanelBuilder;
});
