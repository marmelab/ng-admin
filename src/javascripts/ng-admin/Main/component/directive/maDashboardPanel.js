/*global define*/

define(function (require) {
    'use strict';

    var dashboardPanelView = require('text!../../view/dashboard-panel.html');

    function maDashboardPanel() {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                viewName: '@',
                entries: '=',
                fields: '=',
                entity: '=',
                perPage: '='
            },
            template: dashboardPanelView
        };
    }

    maDashboardPanel.$inject = [];

    return maDashboardPanel;
});
