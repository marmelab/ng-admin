define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View');
    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        listView: null
    };

    /**
     * @constructor
     */
    function FormView() {
    }

    Configurable(FormView.prototype, config);
    angular.extend(FormView, View);

    return FormView;
});
