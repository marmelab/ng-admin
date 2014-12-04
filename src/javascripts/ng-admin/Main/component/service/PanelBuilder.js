/*global define*/

define(function () {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {$filter}            $filter
     * @param {ListRepository} ListRepository
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, $filter, ListRepository, Configuration) {
        this.$q = $q;
        this.$filter = $filter;
        this.ListRepository = ListRepository;
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
            if (!dashboardView.isEnabled()) continue;
            promises.push(self.ListRepository.getAll(dashboardView));
        }

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', '$filter', 'ListRepository', 'NgAdminConfiguration'];

    return PanelBuilder;
});
