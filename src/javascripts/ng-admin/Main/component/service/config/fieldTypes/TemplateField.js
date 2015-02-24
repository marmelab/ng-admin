/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function TemplateField(fieldName) {
        Field.apply(this, arguments);
        this._template = function defaultValueTemplate(entry) {
            return '';
        };
    }

    utils.inherits(TemplateField, Field);

    TemplateField.prototype.template = function(value) {
        if (!arguments.length) return this._template;
        this._template = value;
        return this;
    }

    TemplateField.prototype.getTemplateValue = function (data) {
        return typeof (this._template) === 'function' ? this._template(data) : this._template;
    };

    return TemplateField;
});
