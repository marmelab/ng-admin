define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');
    var utils = require('ng-admin/lib/utils');

    var config = {
    };

    /**
     * @constructor
     */
    function DeleteView() {
        this.quickFilters = {};

        View.apply(this, arguments);
        this.config = angular.extend(this.config, angular.copy(config));
    }

    utils.inherits(DeleteView, View);
    Configurable(DeleteView.prototype, config);

    return DeleteView;
});
