/*global define*/

define(function () {
    'use strict';

    function maExportToCsvButton (Papa, $stateParams, $window, notification, entryFormater, RetrieveQueries) {
        return {
            restrict: 'E',
            scope: {
                entity: '=entity'
            },
            template: '<button class="btn btn-default" ng-click="exportToCsv()"><span class="glyphicon glyphicon-download" aria-hidden="true"></span>Export CSV</button>',
            link: function($scope) {
                var formatEntry = entryFormater($scope.entity.listView().exportFields());

                $scope.exportToCsv = function () {
                    var filter = $stateParams.search;

                    RetrieveQueries.getAll($scope.entity.listView(), -1, true, filter).then(function (response) {
                        var results = [], entries = response.entries;
                        for (var i = entries.length - 1; i >= 0; i--) {
                            results[i] = formatEntry(entries[i]);
                        }
                        var csv = Papa.unparse(results);
                        var fakeLink = document.createElement('a');

                        fakeLink.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(csv));
                        fakeLink.setAttribute('download', $scope.entity.name() + '.csv');
                        fakeLink.click();
                    }, function (error) {
                        notification.log(error.message, {addnCls: 'humane-flatty-error'});
                    });
                };
            },
        };
    }

    maExportToCsvButton.$inject = ['Papa', '$stateParams', '$window', 'notification', 'clEntryFormater', 'RetrieveQueries'];

    return maExportToCsvButton;
});
