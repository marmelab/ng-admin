/*global define*/

define(function (require) {
    'use strict';

    var dashboardPanelView = require('text!../../view/dashboard-panel.html');

    function maDashboardPanel($location) {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                viewName: '@',
                entries: '=',
                fields: '&',
                entity: '&',
                perPage: '=',
                sortDir: '=',
                sortField: '='
            },
            link: function(scope) {
                scope.gotoList = function () {
                    $location.path(scope.entity().name() + '/list/');
                };
            },
            template: dashboardPanelView
        };
    }

    maDashboardPanel.$inject = ['$location'];

    return maDashboardPanel;
});
