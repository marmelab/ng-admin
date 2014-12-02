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
    }

    utils.inherits(ShowView, View);

    return ShowView;
});
