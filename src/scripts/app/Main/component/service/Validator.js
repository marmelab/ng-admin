define([], function() {
    'use strict';

    function Validator(Configuration) {
        this.Configuration = Configuration();
    }

    Validator.prototype.validate = function(entityName, entity) {
        var entityConfig = this.Configuration.getEntity(entityName);

        if (typeof(entityConfig) === 'undefined') {
            return false;
        }

        angular.forEach(entityConfig.getFields(), function(field, name) {
            var validation = field.validation();

            if (typeof(validation.validator) === 'function' && !validation.validator(entity[name])) {
                throw new Error('Field ' + field.label() + ' is not valid.')
            }
        });
    };

    Validator.$inject = ['Configuration'];

    return Validator;
});
