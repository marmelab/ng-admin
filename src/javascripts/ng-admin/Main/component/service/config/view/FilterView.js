/*global define*/

define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     */
    function FilterView() {
        View.apply(this, arguments);

        this.type = 'FilterView';
    }

    utils.inherits(FilterView, View);

    return FilterView;
});
