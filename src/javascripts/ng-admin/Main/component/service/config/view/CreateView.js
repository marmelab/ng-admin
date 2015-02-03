/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     */
    function CreateView() {
        View.apply(this, arguments);

        this.type = 'CreateView';
    }

    utils.inherits(CreateView, View);

    return CreateView;
});
