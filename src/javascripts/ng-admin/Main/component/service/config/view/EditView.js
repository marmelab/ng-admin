/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        utils = require('ng-admin/lib/utils');

    var config = {
        updateMethod: null
    };

    /**
     * @constructor
     */
    function EditView() {
        View.apply(this, arguments);

        this.config = angular.extend(this.config, angular.copy(config));
        this.type = 'EditView';
    }

    utils.inherits(EditView, View);

    /**
     *
     * @returns {string}
     */
    EditView.prototype.getFormName = function () {
        return 'editForm';
    };

    EditView.prototype.showAttributeSuccess = function () {
        return false;
    };

    Configurable(EditView.prototype, config);

    return EditView;
});
