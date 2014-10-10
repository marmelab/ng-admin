define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        limit : 10
    };

    /**
     * @constructor
     */
    function DashboardView() {
    }

    Configurable(DashboardView.prototype, config);
    angular.extend(DashboardView, View);

    return DashboardView;
});
