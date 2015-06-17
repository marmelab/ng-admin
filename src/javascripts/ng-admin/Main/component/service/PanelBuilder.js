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

PanelBuilder.prototype.getCollections = function (sortField, sortDir) {
    return this.Configuration.dashboard().collections();
}

/**
 * Returns all entries for all collections
 *
 * @returns {promise}
 */
PanelBuilder.prototype.getEntries = function (sortField, sortDir) {
    var collections = this.getCollections(),
        dataStore = this.dataStore,
        promises = {},
        collection,
        collectionSortField,
        collectionSortDir,
        self = this,
        collectionName;

    for (collectionName in collections) {
        collection = collections[collectionName];
        collectionSortField = collection.getSortFieldName();
        collectionSortDir = collection.sortDir();
        if (sortField && sortField.split('.')[0] === collection.name()) {
            collectionSortField = sortField;
            collectionSortDir = sortDir;
        }
        promises[collectionName] = (function (collection, collectionSortField, collectionSortDir) {
            var rawEntries, nonOptimizedReferencedData, optimizedReferencedData;

            return self.ReadQueries
                .getAll(collection, 1, {}, collectionSortField, collectionSortDir)
                .then(function (response) {
                    rawEntries = response.data;

                    return rawEntries;
                })
                .then(function (rawEntries) {
                    return self.ReadQueries.getFilteredReferenceData(collection.getNonOptimizedReferences(), rawEntries);
                })
                .then(function (nonOptimizedReference) {
                    nonOptimizedReferencedData = nonOptimizedReference;

                    return self.ReadQueries.getOptimizedReferencedData(collection.getOptimizedReferences(), rawEntries);
                })
                .then(function (optimizedReference) {
                    optimizedReferencedData = optimizedReference;

                    var references = collection.getReferences(),
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
                        collection.entity.name(),
                        collection.identifier(),
                        collection.getFields(),
                        rawEntries
                    );

                    // shortcut to diplay collection of entry with included referenced values
                    dataStore.fillReferencesValuesFromCollection(entries, collection.getReferences(), true);

                    return entries;
                });
        })(collection, collectionSortField, collectionSortDir);
    }

    return this.$q.all(promises).then(function (responses) {
        var collectionName,
            entries = {};

        for (collectionName in responses) {
            entries[collections[collectionName].name()] = responses[collectionName];
        }

        return entries;
    });
};

PanelBuilder.$inject = ['$q', 'ReadQueries', 'NgAdminConfiguration', 'AdminDescription'];

module.exports = PanelBuilder;
