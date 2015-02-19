/*global define*/

define(function () {
    'use strict';

    function FieldViewConfiguration() {
        this.fieldViews = {};
    }

    FieldViewConfiguration.prototype.registerFieldView = function(type, FieldView) {
        this.fieldViews[type] = FieldView;
    }

    FieldViewConfiguration.prototype.$get = function () {
        return this.fieldViews;
    };

    FieldViewConfiguration.$inject = [];

    return FieldViewConfiguration;
});
