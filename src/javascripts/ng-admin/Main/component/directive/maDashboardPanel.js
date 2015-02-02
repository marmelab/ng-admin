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
                perPage: '='
            },
            link: function(scope) {
                scope.gotoList = function () {
                    $location.path('/list/' + scope.entity().name());
                };
            },
            template: dashboardPanelView
        };
    }

    maDashboardPanel.$inject = ['$location'];

    return maDashboardPanel;
});
