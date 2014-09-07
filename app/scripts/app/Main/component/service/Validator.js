define(['config'], function(config) {
    'use strict';

    function Validator() {
    }

    Validator.prototype.validate = function(entityName, entity) {
        if (typeof (config.entities[entityName]) === 'undefined') {
            return false;
        }

        var entityConfig = config.entities[entityName],
            validation;

        entityConfig.fields.forEach(function(field) {
            validation = field.validation;
            console.log(validation);
        })
    };

    return Validator;
});
