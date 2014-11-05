/*global define*/

define(function (require) {
    'use strict';

    var dashboardPanelView = require('text!../../view/dashboard-panel.html');

    function DashboardPanel() {
        return {
            restrict: 'E',
            template: dashboardPanelView
        };
    }

    DashboardPanel.$inject = [];

    return DashboardPanel;
});
