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
        var dashboardViews = this.Configuration.getViewsOfType('DashboardView'),
            searchParams = this.$location.search(),
            sortField = searchParams.sortField,
            sortDir = searchParams.sortDir,
            promises = [],
            dashboardView,
            self = this,
            i;

        dashboardViews = this.$filter('enabled')(dashboardViews);
        dashboardViews = this.$filter('orderElement')(dashboardViews);

        for (i in dashboardViews) {
            dashboardView = dashboardViews[i];
            promises.push(self.RetrieveQueries.getAll(dashboardView, 1, true, null, sortField, sortDir));
        }

        return this.$q.all(promises).then(function (panelData) {
            var i,
                data,
                view,
                panels = [];

            for (i in panelData) {
                data = panelData[i];
                view = dashboardViews[i]
                panels.push({
                    label: view.title() || view.getEntity().label(),
                    viewName: view.name(),
                    fields: view.fields(),
                    entity: view.getEntity(),
                    perPage: view.perPage(),
                    entries: data.entries
                });
            }

            return panels;
        });
    };

    PanelBuilder.$inject = ['$q', '$filter', '$location', 'RetrieveQueries', 'NgAdminConfiguration'];

    return PanelBuilder;
});
