/*global define*/

define(function () {
    'use strict';

    function EntryFormatter() {
    }

    EntryFormatter.prototype.formatField = function formatField(field) {
        var label = field.label() || field.name();
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
                return { label: label, name: field.name(), type: 'field' };
            case 'reference':
                return { label: label, name: field.name(), type: 'reference' };
            case 'referenced_list':
                return; //ignored
        }
    };

    EntryFormatter.prototype.getFormatter = function getFormatter(fields) {
        var formattedFields = fields.map(this.formatField);

        return function formatEntry(entry) {
            var result = {}, i, length = formattedFields.length, field;

            for (i = 0; i < length; i++) {
                field = formattedFields[i];
                if (!field) {continue;}
                if (field.type === 'reference') {
                    result[field.label] = entry.listValues[field.name];
                } else if (field.type === 'field') {
                    if ('undefined' === typeof entry.values[field.name]) {continue;}
                    result[field.label] = entry.values[field.name];
                }
            }

            return result;
        };
    };

    EntryFormatter.$inject = [];

    return EntryFormatter;
});
