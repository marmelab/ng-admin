define(['config'], function(config) {
    'use strict';

    function Validator() {
    }

    Validator.prototype.validate = function(entityName, entity) {
        var entityConfig = config.getEntity(entityName);

        if (typeof(entityConfig) === 'undefined') {
            return false;
        }

        angular.forEach(entityConfig.getFields(), function(field, name) {
            var validation = field.validation();

            if (typeof(validation.validator) === 'function') {
                if (!validation.validator(entity[name])) {
                    throw new Error('Field ' + field.label() + ' is not valid.')
                }
            }
        });
    };

    return Validator;
});
