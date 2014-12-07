/*global define*/

define(function () {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {$filter}            $filter
     * @param {RetrieveQueries}    RetrieveQueries
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, $filter, RetrieveQueries, Configuration) {
        this.$q = $q;
        this.$filter = $filter;
        this.RetrieveQueries = RetrieveQueries;
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

            promises.push(self.RetrieveQueries.getAll(dashboardView));
        }

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', '$filter', 'RetrieveQueries', 'NgAdminConfiguration'];

    return PanelBuilder;
});
