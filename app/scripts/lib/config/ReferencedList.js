define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    return function(fieldName) {
        var name = fieldName || 'reference';
        var items = [];

        var config = {
            type: 'referenced-list',
            label: 'My list',
            order: 1,
            list: false,
            targetEntity : null,
            targetField : null,
            targetFields : []
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

        ReferencedList.getItems = function() {
            return items;
        };

        ReferencedList.setItems = function(i) {
            items = i;

            return this;
        };

        ReferencedList.getGridParams = function() {
            var items = this.getItems(),
                columns = [];

            for (var i = 0, l = config.targetFields.length; i < l; i++) {
                var field = config.targetFields[i];

                columns.push({
                    field: field.getName(),
                    label: field.label()
                });
            }

            return {
                dimensions : [ columns.length, items.length ],
                columns: columns,
                items: items
            }
        };

        Configurable(ReferencedList, config);

        return ReferencedList;
    }
});
