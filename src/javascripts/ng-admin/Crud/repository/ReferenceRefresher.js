class ReferenceRefresher {
    constructor(ReadQueries) {
        this.ReadQueries = ReadQueries;
    }

    refresh(field, currentValue, search) {
        var referenceFields = {};
        referenceFields[field.name()] = field;

        return this.ReadQueries.getAllReferencedData(referenceFields, search)
            .then(r => r[field.name()])
            .then(results => this._transformRecords(field, results))
            .then(formattedResults => {
                if (!currentValue) {
                    return formattedResults;
                }

                //remove already assigned values: ui-select still return them if multiple
                var selectedValues = currentValue.map(v => v.value);
                return formattedResults.filter(fr => selectedValues.indexOf(fr.value) === -1);
            });
    }

    getInitialChoices(field, values) {
        return this.ReadQueries.getRecordsByIds(field.targetEntity(), values).then(
            records => this._transformRecords(field, records)
        );
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
