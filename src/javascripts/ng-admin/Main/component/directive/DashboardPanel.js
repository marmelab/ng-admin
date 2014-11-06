define(function(require) {
    'use strict';

    var angular = require('angular'),
        dashboardPanelView = require('text!../../view/dashboard-panel.html');

    function DashboardPanel() {
        return {
            restrict: 'E',
            template: dashboardPanelView
        };
    }

    DashboardPanel.$inject = [];

    return DashboardPanel;
});
