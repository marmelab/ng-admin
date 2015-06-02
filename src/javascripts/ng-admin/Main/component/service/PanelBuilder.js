/**
 * @param {$q}                 $q
 * @param {$location}          $location
 * @param {ReadQueries}        ReadQueries
 * @param {Configuration}      Configuration
 * @param {AdminDescription}   AdminDescription
 *
 * @constructor
 */
function PanelBuilder($q, $location, ReadQueries, Configuration, AdminDescription) {
    this.$q = $q;
    this.$location = $location;
    this.ReadQueries = ReadQueries;
    this.dataStore = AdminDescription.getDataStore();
    this.Configuration = Configuration();
}

PanelBuilder.prototype.hasEntities = function() {
    return this.Configuration.entities.length > 0;
}

/**
 * Returns all elements of each dashboard panels
 *
 * @returns {promise}
 */
PanelBuilder.prototype.getPanelsData = function (sortField, sortDir) {
    var dashboardViews = this.Configuration.getViewsOfType('DashboardView'),
        dataStore = this.dataStore,
        promises = [],
        dashboardView,
        dashboardSortField,
        dashboardSortDir,
        self = this,
        i;

    for (i in dashboardViews) {
        dashboardView = dashboardViews[i];
        dashboardSortField = dashboardView.getSortFieldName();
        dashboardSortDir = dashboardView.sortDir();
        if (sortField && sortField.split('.')[0] === dashboardView.name()) {
            dashboardSortField = sortField;
            dashboardSortDir = sortDir;
        }
        promises.push(self.ReadQueries.getAll(dashboardView, 1, {}, dashboardSortField, dashboardSortDir));
    }

    return this.$q.all(promises).then(function (responses) {
        var i,
            response,
            view,
            entity,
            fields,
            panels = [];

        for (i in responses) {
            response = responses[i];
            view = dashboardViews[i];
            entity = view.getEntity();
            fields = view.fields();

            panels.push({
                label: view.title() || view.getEntity().label(),
                viewName: view.name(),
                fields: fields,
                entity: entity,
                perPage: view.perPage(),
                entries: dataStore.mapEntries(entity.name(), entity.identifier(), fields, response.data),
                sortField: view.getSortFieldName(),
                sortDir: view.sortDir()
            });
        }

        return panels;
    });
};

PanelBuilder.$inject = ['$q', '$location', 'ReadQueries', 'NgAdminConfiguration', 'AdminDescription'];

module.exports = PanelBuilder;
