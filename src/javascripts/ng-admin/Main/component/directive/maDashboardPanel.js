var dashboardPanelView = require('../../view/dashboard-panel.html');

function maDashboardPanel($state) {
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
                $state.go($state.get('list'), { entity: scope.entity().name() });
            };
        },
        template: dashboardPanelView
    };
}

maDashboardPanel.$inject = ['$state'];

module.exports = maDashboardPanel;

