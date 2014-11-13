/*global define*/

define(function () {
    'use strict';

    function Validator() {
    }

    /**
     * Validate views fields
     *
     * @param {View}  view
     * @param {Entry} entry
     *
     * @returns {boolean}
     */
    Validator.prototype.validate = function (view, entry) {
        var fields = view.getFields(),
            validation,
            field,
            i;

        for (i in fields) {
            field = fields[i];
            validation = field.validation();

            if (typeof (validation.validator) === 'function') {
                validation.validator(entry.values[field.name()]);
            }
        }
    };

    Validator.$inject = [];

    return Validator;
});
