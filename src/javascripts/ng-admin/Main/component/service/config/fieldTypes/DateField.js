/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function DateField() {
        Field.apply(this, arguments);
        this._format = 'yyyy-MM-dd';
        this._parse = function(date) {
            if (date instanceof Date) {
                // the datepicker returns a JS Date object, with hours, minutes and timezone
                // in order to convert it back to date, we must remove the timezone, then
                // remove hours and minutes
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                var dateString = date.toJSON();
                return dateString ? dateString.substr(0,10) : null;
            }
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
