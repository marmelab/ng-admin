/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     */
    function DashboardView() {
        ListView.apply(this, arguments);

		this.type = 'DashboardView';
    }

    utils.inherits(DashboardView, ListView);

    /**
     * Set or get the dashboard panel limit
     *
     * @param {Number} limit
     */
    DashboardView.prototype.limit = function (limit) {
        return this.perPage(limit);
    };

    return DashboardView;
});
