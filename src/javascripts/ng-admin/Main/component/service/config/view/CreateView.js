/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils');

    var config = {
        listView: null
    };

    /**
     * @constructor
     */
    function CreateView() {
        View.apply(this, arguments);

        this.config = angular.extend(this.config, angular.copy(config));

        this.config.title = function (view) {
            return 'Create ' + view.getEntity().name();
        };
    }

    utils.inherits(CreateView, View);
    Configurable(CreateView.prototype, config);

    return CreateView;
});
