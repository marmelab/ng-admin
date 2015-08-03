class ReferenceRefresher {
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

    getInitialChoices(field, values) {
        return this.ReadQueries.getRecordsByIds(field.targetEntity(), values)
            .then(results => this._removeDuplicates(results, values))
            .then(records => this._transformRecords(field, records));
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
        var valueFieldName = field.targetEntity().identifier().name();
        var labelFieldName = field.targetField().name();

        return records.map(function(r) {
            return {
                value: r[valueFieldName],
                label: field.getMappedValue(r[labelFieldName], r)
            };
        });
    }
}

ReferenceRefresher.$inject = ['ReadQueries'];

export default ReferenceRefresher;
