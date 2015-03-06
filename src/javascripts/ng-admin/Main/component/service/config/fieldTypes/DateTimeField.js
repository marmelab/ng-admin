/*global define*/

define(function (require) {
    'use strict';

    var DateField = require('ng-admin/Main/component/service/config/fieldTypes/DateField'),
        utils = require('ng-admin/lib/utils');

    function DateTimeField() {
        DateField.apply(this, arguments);
        this._format = 'yyyy-MM-dd HH:mm:ss';
        this._parse = function(date) {
            return date;
        };
    }

    utils.inherits(DateTimeField, DateField);

    return DateTimeField;
});
