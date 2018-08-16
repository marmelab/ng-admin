export default class EntryFormatter {
    constructor($filter) {
        this.formatDate = function (format) {
            return function (date) {
                return $filter('date')(date, format);
            };
        };
        this.formatNumber = function (format) {
            return function (number) {
                return $filter('numeraljs')(number, format);
            };
        };
    }

    formatField(field) {
        var label = field.label() || field.name();
        var type = field.type();
        switch (type) {
            case 'boolean':
            case 'choice':
            case 'choices':
            case 'string':
            case 'text':
            case 'wysiwyg':
            case 'email':
            case 'json':
            case 'file':
                return function (entry) {
                    return {
                        name: label,
                        value: entry.values[field.name()]
                    };
                };
            case 'template':
                return function (entry) {
                    return {
                        name: label,
                        value: field.getTemplateValue(entry)
                    };
                };
            case 'number':
            case 'float':
                var formatNumber = this.formatNumber(field.format());
                return function (entry) {
                    return {
                        name: label,
                        value: formatNumber(entry.values[field.name()])
                    };
                };
            case 'date':
            case 'datetime':
                var format = field.format();
                if (!format) {
                    format = type === 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss';
                }

                var formatDate = this.formatDate(format);
                return function (entry) {
                    return {
                        name: label,
                        value: formatDate(entry.values[field.name()])
                    };
                };
            case 'reference':
                return function (entry) {
                    return {
                        name: label,
                        value: entry.listValues[field.name()]
                    };
                };
            case 'reference_many':
                return function (entry) {
                    return {
                        name: label,
                        value: entry.listValues[field.name()].join(', ')
                    };
                };
            case 'embedded_list':
                return function (entry) {
                    return {
                        name: label,
                        value: entry.values[field.name()].map((obj => obj[field.targetFields()[0].name()]))
                    };
                };
            case 'referenced_list':
                return; //ignored
        }
    }

    getFormatter(fields) {
        var fieldsFormatters = fields.map(this.formatField.bind(this));

        return function formatEntry(entry) {
            var result = {};
            fieldsFormatters.map(function (formatter) {
                if (!formatter) {
                    return;
                }
                return formatter(entry);
            })
            .forEach(function (field) {
                if (!field) {
                    return;
                }
                result[field.name] = field.value;
            });

            return result;
        };
    }
}

EntryFormatter.$inject = ['$filter'];
