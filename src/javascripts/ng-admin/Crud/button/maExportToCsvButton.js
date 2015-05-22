/*global define*/

define(function () {
    'use strict';

    function maExportToCsvButton ($stateParams, Papa, notification, entryFormatter, ReadQueries) {
        return {
            restrict: 'E',
            scope: {
                entity: '&',
                label: '@',
                datastore: '&'
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
                }
                scope.has_export = exportView.fields().length > 0;
                var formatEntry = entryFormatter.getFormatter(exportView.fields());

                scope.exportToCsv = function () {

                    ReadQueries.getAll(exportView, -1, true, $stateParams.search, $stateParams.sortField, $stateParams.sortDir).then(function (response) {
                        var results = [];
                        var entries = scope.datastore.mapEntries(scope.entity.name(), exportView.identifier(), exportView.fields(), response.data);
                        for (var i = entries.length - 1; i >= 0; i--) {
                            results[i] = formatEntry(entries[i]);
                        }
                        var csv = Papa.unparse(results);
                        var fakeLink = document.createElement('a');

                        fakeLink.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csv));
                        fakeLink.setAttribute('download', scope.entity.name() + '.csv');
                        fakeLink.click();
                    }, function (error) {
                        notification.log(error.message, {addnCls: 'humane-flatty-error'});
                    });
                };
            },
        };
    }

    maExportToCsvButton.$inject = ['$stateParams', 'Papa', 'notification', 'EntryFormatter', 'ReadQueries'];

    return maExportToCsvButton;
});
