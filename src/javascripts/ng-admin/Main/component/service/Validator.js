define(function() {
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
    Validator.prototype.validate = function(view) {
        angular.forEach(view.getFields(), function(field, name) {
            var validation = field.validation();

            if (typeof(validation.validator) === 'function' && !validation.validator(field.value)) {
                throw new Error('Field "' + field.label() + '" is not valid.')
            }
        });
    };

    Validator.$inject = [];

    return Validator;
});
