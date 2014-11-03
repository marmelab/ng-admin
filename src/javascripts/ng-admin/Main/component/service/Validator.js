/*global define*/

define(function () {
    'use strict';

    function Validator() {
    }

    /**
     * Validate views fields
     *
     * @param {View} view
     *
     * @returns {boolean}
     */
    Validator.prototype.validate = function (view) {
        var fields = view.getFields(),
            validation,
            field,
            i;

        for (i in fields) {
            field = fields[i];
            validation = field.validation();

            if (typeof (validation.validator) === 'function' && !validation.validator(field.value())) {
                throw new Error('Field "' + field.label() + '" is not valid.');
            }
        }
    };

    Validator.$inject = [];

    return Validator;
});
