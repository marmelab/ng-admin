/*global define*/

define(function () {
    'use strict';

    /**
     * @param {$q}                 $q
     * @param {$filter}            $filter
     * @param {$location}          $location
     * @param {RetrieveQueries}    RetrieveQueries
     * @param {Configuration}      Configuration
     *
     * @constructor
     */
    function PanelBuilder($q, $filter, $location, RetrieveQueries, Configuration) {
        this.$q = $q;
        this.$filter = $filter;
        this.$location = $location;
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
            searchParams = this.$location.search(),
            sortField = searchParams.sortField,
            sortDir = searchParams.sortDir,
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

            promises.push(self.RetrieveQueries.getAll(dashboardView, 1, true, null, sortField, sortDir));
        }

        return this.$q.all(promises);
    };

    PanelBuilder.$inject = ['$q', '$filter', '$location', 'RetrieveQueries', 'NgAdminConfiguration'];

    return PanelBuilder;
});
