/*global define*/

define(function () {
    'use strict';

    function maExportToCsvButton ($stateParams, Papa, notification, entryFormatter, RetrieveQueries) {
        return {
            restrict: 'E',
            scope: {
                entity: '&'
            },
            template: '<button ng-if="has_export" class="btn btn-default" ng-click="exportToCsv()"><span class="glyphicon glyphicon-download" aria-hidden="true"></span>&nbsp;Export</button>',
            link: function(scope) {
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

                    RetrieveQueries.getAll(exportView, -1, true, $stateParams.search, $stateParams.sortField, $stateParams.sortDir).then(function (response) {
                        var results = [], entries = response.entries;
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

    maExportToCsvButton.$inject = ['$stateParams', 'Papa', 'notification', 'EntryFormatter', 'RetrieveQueries'];

    return maExportToCsvButton;
});
