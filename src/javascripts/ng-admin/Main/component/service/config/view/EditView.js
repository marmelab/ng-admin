/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        View = require('ng-admin/Main/component/service/config/view/View'),
        utils = require('ng-admin/lib/utils');

    /**
     * @constructor
     */
    function EditView() {
        View.apply(this, arguments);

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

    EditView.prototype.getAttributeClass = function (isValid) {
        if (undefined === isValid) {
            return '';
        }

        return isValid ? '' : 'has-error';
    };

    EditView.prototype.showAttributeSuccess = function () {
        return false;
    };

    return EditView;
});
