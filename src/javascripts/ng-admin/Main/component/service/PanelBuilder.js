/*global define*/

define(function () {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {$filter}            $filter
     * @param {RetrieveRepository} RetrieveRepository
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, $filter, RetrieveRepository, Configuration) {
        this.$q = $q;
        this.$filter = $filter;
        this.RetrieveRepository = RetrieveRepository;
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
            if (!dashboardView.isEnabled()) {
                continue;
            }

            promises.push(self.RetrieveRepository.getAll(dashboardView));
        }

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', '$filter', 'RetrieveRepository', 'NgAdminConfiguration'];

    return PanelBuilder;
});
