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

        view.getFields().forEach(function (field) {
            var validation = field.validation();
            if (typeof (validation.validator) === 'function') {
                validation.validator(entry.values[field.name()]);
            }
        });
    };

    Validator.$inject = [];

    return Validator;
});
