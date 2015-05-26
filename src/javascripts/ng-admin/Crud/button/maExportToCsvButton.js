/*global define*/

define(function () {
    'use strict';

    function maExportToCsvButton ($stateParams, Papa, notification, entryFormatter, ReadQueries) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                label: '@',
                datastore: '&',
                search: '&'
            },
            template: '<button ng-if="has_export" class="btn btn-default" ng-click="exportToCsv()"><span class="glyphicon glyphicon-download" aria-hidden="true"></span>&nbsp;{{ ::label }}</button>',
            link: function(scope) {
                scope.label = scope.label || 'Export';

                scope.datastore = scope.datastore();
                scope.entity = scope.entity();
                var exportView = scope.entity.exportView();
                var listView = scope.entity.listView();
                if (exportView.fields().length === 0) {
                    var exportFields = listView.exportFields();
                    if (exportFields === null) {
                        exportFields = listView.fields();
                    }
                    exportView.fields(exportFields);
                    exportView.filters(listView.filters());
                }
                scope.has_export = exportView.fields().length > 0;
                var formatEntry = entryFormatter.getFormatter(exportView.fields());

                scope.exportToCsv = function () {
                    var rawEntries;
                    var nonOptimizedReferencedData;
                    var optimizedReferencedData;

                    ReadQueries.getAll(exportView, -1, scope.search(), $stateParams.sortField, $stateParams.sortDir)
                        .then(function (response) {
                            rawEntries = response.data;

                            return rawEntries;
                        }, function (error) {
                            notification.log(error.message, {addnCls: 'humane-flatty-error'});
                        })
                        .then(function (rawEntries) {
                            nonOptimizedReferencedData = ReadQueries.getFilteredReferenceData(exportView.getNonOptimizedReferences(), rawEntries);

                            return rawEntries;
                        })
                        .then(function (rawEntries) {
                            optimizedReferencedData = ReadQueries.getOptimizedReferencedData(exportView.getOptimizedReferences(), rawEntries);

                            return rawEntries;
                        })
                        .then(function (rawEntries) {
                            var references = exportView.getReferences(),
                                referencedData = angular.extend(nonOptimizedReferencedData, optimizedReferencedData),
                                referencedEntries;

                            for (var name in referencedData) {
                                referencedEntries = scope.datastore.mapEntries(
                                    references[name].targetEntity().name(),
                                    references[name].targetEntity().identifier(),
                                    [references[name].targetField()],
                                    referencedData[name]
                                );

                                scope.datastore.setEntries(
                                    references[name].targetEntity().uniqueId + '_values',
                                    referencedEntries
                                );
                            }

                            return rawEntries;
                        })
                        .then(function (rawEntries) {
                            var entries = scope.datastore.mapEntries(
                                exportView.entity.name(),
                                exportView.identifier(),
                                exportView.getFields(),
                                rawEntries
                            );

                            // shortcut to diplay collection of entry with included referenced values
                            scope.datastore.fillReferencesValuesFromCollection(entries, exportView.getReferences(), true);

                            var results = [];
                            for (var i = entries.length - 1; i >= 0; i--) {
                                results[i] = formatEntry(entries[i]);
                            }
                            var csv = Papa.unparse(results);
                            var fakeLink = document.createElement('a');

                            fakeLink.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csv));
                            fakeLink.setAttribute('download', scope.entity.name() + '.csv');
                            fakeLink.click();
                        })
                        ;
                };
            },
        };
    }

    maExportToCsvButton.$inject = ['$stateParams', 'Papa', 'notification', 'EntryFormatter', 'ReadQueries'];

    return maExportToCsvButton;
});
