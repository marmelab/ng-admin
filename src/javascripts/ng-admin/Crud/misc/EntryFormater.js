/*global define*/

define(function () {
    'use strict';

    function EntryFormater() {
    }

    EntryFormater.format = function format(fields) {
        var map = [];
        for (var attr in fields) {
            if (!fields.hasOwnProperty(attr)) {continue;}
            var order = fields[attr].order();
            switch (fields[attr].type()) {
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
                    map[order] = {name: attr, type: 'Field'};
                    break;
                case 'reference':
                    map[order] = {name: attr, type: 'Reference'};
                    break;
                case 'referenced_list':
                    break;//ignored
            }
        }

        return function formatEntry(entry) {
            var result = {}, i, length = map.length, field;
            for (i = 0; i < length; i++) {
                field = map[i];
                if (!field) {continue;}
                if (field.type === 'Reference') {
                    result[field.name] = entry.listValues[field.name];
                } else if (field.type === 'Field') {
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
