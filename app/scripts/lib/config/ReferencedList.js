define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    return function(fieldName) {
        var name = fieldName || 'reference';
        var values = [];

        var config = {
            type: 'referenced-list',
            label: 'My list',
            order: 1,
            list: false,
            targetEntity : null,
            targetField : null,
            targetFields : null
        };

        /**
         * @constructor
         */
        function ReferencedList(label) {
            this.label(label);
        }

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        ReferencedList.getName = function() {
            return name;
        };


        ReferencedList.getValues = function() {
            return values;
        };

        ReferencedList.setValues = function(v) {
            values = v;

            return this;
        };

        Configurable(ReferencedList, config);

        return ReferencedList;
    }
});
