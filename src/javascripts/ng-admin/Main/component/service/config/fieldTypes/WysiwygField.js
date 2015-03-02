/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function WysiwygField(fieldName) {
        Field.apply(this, arguments);
        this._stripTags = false;
    }

    utils.inherits(WysiwygField, Field);

    WysiwygField.prototype.stripTags = function(value) {
        if (!arguments.length) return this._stripTags;
        this._stripTags = value;
        return this;
    }

    return WysiwygField;
});
