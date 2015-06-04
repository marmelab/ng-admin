/**
 * @param {$q}                 $q
 * @param {ReadQueries}        ReadQueries
 * @param {Configuration}      Configuration
 * @param {AdminDescription}   AdminDescription
 *
 * @constructor
 */
function PanelBuilder($q, ReadQueries, Configuration, AdminDescription) {
    this.$q = $q;
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
        promises.push((function (dashboardView, dashboardSortField, dashboardSortDir) {
            var rawEntries, nonOptimizedReferencedData, optimizedReferencedData;

            return self.ReadQueries
                .getAll(dashboardView, 1, {}, dashboardSortField, dashboardSortDir)
                .then(function (response) {
                    rawEntries = response.data;

                    return rawEntries;
                })
                .then(function (rawEntries) {
                    return self.ReadQueries.getFilteredReferenceData(dashboardView.getNonOptimizedReferences(), rawEntries);
                })
                .then(function (nonOptimizedReference) {
                    nonOptimizedReferencedData = nonOptimizedReference;

                    return self.ReadQueries.getOptimizedReferencedData(dashboardView.getOptimizedReferences(), rawEntries);
                })
                .then(function (optimizedReference) {
                    optimizedReferencedData = optimizedReference;

                    var references = dashboardView.getReferences(),
                        referencedData = angular.extend(nonOptimizedReferencedData, optimizedReferencedData),
                        referencedEntries;

                    for (var name in referencedData) {
                        referencedEntries = dataStore.mapEntries(
                            references[name].targetEntity().name(),
                            references[name].targetEntity().identifier(),
                            [references[name].targetField()],
                            referencedData[name]
                        );

                        dataStore.setEntries(
                            references[name].targetEntity().uniqueId + '_values',
                            referencedEntries
                        );
                    }
                })
                .then(function () {
                    var entries = dataStore.mapEntries(
                        dashboardView.entity.name(),
                        dashboardView.identifier(),
                        dashboardView.getFields(),
                        rawEntries
                    );


                    // shortcut to diplay collection of entry with included referenced values
                    dataStore.fillReferencesValuesFromCollection(entries, dashboardView.getReferences(), true);

                    return {
                        entries: entries
                    };
                });
        })(dashboardView, dashboardSortField, dashboardSortDir));
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
                entries: response.entries,
                sortField: view.getSortFieldName(),
                sortDir: view.sortDir()
            });
        }

        return panels;
    });
};

PanelBuilder.$inject = ['$q', 'ReadQueries', 'NgAdminConfiguration', 'AdminDescription'];

module.exports = PanelBuilder;
