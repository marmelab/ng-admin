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

    /**
     *
     * @returns {string}
     */
    CreateView.prototype.getFormName = function () {
        return 'createForm';
    };

    CreateView.prototype.getAttributeClass = function (isValid) {
        return isValid ? 'has-success' : '';
    };

    CreateView.prototype.showAttributeSuccess = function () {
        return true;
    };

    return CreateView;
});
