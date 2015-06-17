var dashboardPanelView = require('../../view/dashboard-panel.html');

function maDashboardPanel($state) {
    return {
        restrict: 'E',
        scope: {
            collection: '&',
            entries: '&'
        },
        link: function(scope) {
            scope.collection = scope.collection();
            scope.gotoList = function () {
                $state.go($state.get('list'), { entity: scope.collection.entity.name() });
            };
        },
        template: dashboardPanelView
    };
}

maDashboardPanel.$inject = ['$state'];

module.exports = maDashboardPanel;

