define(function (require) {
    'use strict';

    var ListView = require('ng-admin/Main/component/service/config/view/View');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var utils = require('ng-admin/lib/utils');

    var config = {
        limit: 10
    };

    /**
     * @constructor
     */
    function DashboardView() {
        ListView.apply(this, arguments);

        this.config = angular.extend(this.config, angular.copy(config));
    }

    utils.inherits(DashboardView, ListView);
    Configurable(DashboardView.prototype, config);

    return DashboardView;
});
