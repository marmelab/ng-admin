/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function FileField(fieldName) {
        Field.apply(this, arguments);
        this._uploadInformation = {
            url: '/upload',
            accept: '*'
        };
    }

    utils.inherits(FileField, Field);

    FileField.prototype.uploadInformation = function(value) {
        if (!arguments.length) return this._uploadInformation;
        this._uploadInformation = value;
        return this;
    }

    return FileField;
});
