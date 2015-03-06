/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function NumberField() {
        Field.apply(this, arguments);
        this._fractionSize = undefined;
    }

    utils.inherits(NumberField, Field);

    /**
     * Number of decimal places to round the number to. If this is not provided,
     * then the fraction size is computed from the current locale's number formatting pattern.
     * In the case of the default locale, it will be 3.
     *
     * {@example}
     *
     *     nga.field('height', 'number').fractionSize(2);
     */
    NumberField.prototype.fractionSize = function(value) {
        if (!arguments.length) return this._fractionSize;
        this._fractionSize = value;
        return this;
    };

    return NumberField;
});
