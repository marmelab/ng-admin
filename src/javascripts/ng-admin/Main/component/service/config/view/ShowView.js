/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     */
    function ShowView() {
        View.apply(this, arguments);
        this.type = 'ShowView';
        this.config.title = function (view) {
            return 'Show ' + view.getEntity().name();
        };
    }

    utils.inherits(ShowView, View);

    return ShowView;
});
