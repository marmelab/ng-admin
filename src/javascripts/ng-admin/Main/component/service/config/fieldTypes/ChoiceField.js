/*global define*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        utils = require('ng-admin/lib/utils');

    function ChoiceField(fieldName) {
        Field.apply(this, arguments);
        this._choices = [];
    }

    utils.inherits(ChoiceField, Field);

    ChoiceField.prototype.choices = function(value) {
        if (!arguments.length) return this._choices;
        this._choices = value;
        return this;
    };

    ChoiceField.prototype.getLabelForChoice = function(value) {
        var choice = this._choices.filter(function(choice) { 
            return choice.value == value 
        }).pop();
        return choice ? choice.label : null;
    };

    return ChoiceField;
});
