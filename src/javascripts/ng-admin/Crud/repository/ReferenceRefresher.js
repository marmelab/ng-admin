import Entry from 'admin-config/lib/Entry'

export default class ReferenceRefresher {
    constructor(ReadQueries) {
        this.ReadQueries = ReadQueries;
    }

    refresh(field, currentValue, search) {
        var referenceFields = {};
        referenceFields[field.name()] = field;

        var promise = this.ReadQueries.getAllReferencedData(referenceFields, search)
            .then(r => r[field.name()])
            .then(results => this._transformRecords(field, results));

        if (field.type() === 'reference_many' || field.type() === 'choices') {
            promise = promise.then(formattedResults => this._removeDuplicates(formattedResults, currentValue));
        }

        return promise;
    }

    _removeDuplicates(results, currentValue) {
        // remove already assigned values: ui-select still return them if multiple
        if (!currentValue) {
            return results;
        }

        if (!Array.isArray(currentValue)) {
            currentValue = [currentValue];
        }

        return results.filter(fr => currentValue.indexOf(fr.value) === -1);
    }

    _transformRecords(field, records) {
        var targetEntity = field.targetEntity();
        var targetField = field.targetField();
        var valueFieldName = targetEntity.identifier().name();
        var labelFieldName = targetField.name();
        return Entry.createArrayFromRest(
            records,
            [targetField],
            targetEntity.name(),
            valueFieldName
        ).map(function(r) {
            return {
                value: r.values[valueFieldName],
                label: r.values[labelFieldName]
            };
        });
    }
}

ReferenceRefresher.$inject = ['ReadQueries'];
