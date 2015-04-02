/*global define*/

define(function () {
    'use strict';

    function EntryFormater() {
    }

    EntryFormater.prototype.format = function format(fields) {
        var map = fields.map(function (field) {
            switch (field.type()) {
                case 'number':
                case 'text':
                case 'wysiwyg':
                case 'string':
                case 'boolean':
                case 'email':
                case 'json':
                case 'date':
                case 'choice':
                case 'choices':
                case 'file':
                case 'template':
                    return {name: field.name(), type: 'field'};
                case 'reference':
                    return {name: field.name(), type: 'reference'};
                case 'referenced_list':
                    return;//ignored
            }
        });

        return function formatEntry(entry) {
            var result = {}, i, length = map.length, field;

            for (i = 0; i < length; i++) {
                field = map[i];
                if (!field) {continue;}
                if (field.type === 'reference') {
                    result[field.name] = entry.listValues[field.name];
                } else if (field.type === 'field') {
                    if ('undefined' === typeof entry.values[field.name]) {continue;}
                    result[field.name] = entry.values[field.name];
                }
            }

            return result;
        };
    };

    EntryFormater.$inject = [];

    return EntryFormater;
});
