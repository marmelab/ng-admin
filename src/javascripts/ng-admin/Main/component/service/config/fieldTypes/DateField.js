/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function DateField(fieldName) {
        Field.apply(this, arguments);
        this._format = 'yyyy-MM-dd';
        this._parse = function (date) {
            return date;
        };
    }

    utils.inherits(DateField, Field);

    DateField.prototype.format = function(value) {
        if (!arguments.length) return this._format;
        this._format = value;
        return this;
    };

    DateField.prototype.parse = function(value) {
        if (!arguments.length) return this._parse;
        this._parse = value;
        return this;
    };

    return DateField;
});
