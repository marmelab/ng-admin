class ReferenceRefresher {
    constructor(ReadQueries) {
        this.ReadQueries = ReadQueries;
    }

    refresh(field, currentValue, search) {
        var referenceFields = {};
        referenceFields[field.name()] = field;

        var valueFieldName = field.targetEntity().identifier().name();
        var labelFieldName = field.targetField().name();

        return this.ReadQueries.getAllReferencedData(referenceFields, search)
            .then(r => r[field.name()])
            .then(results => {
                return results.map(function(r) {
                    return {
                        value: r[valueFieldName],
                        label: field.getMappedValue(r[labelFieldName], r)
                    };
                });
            })
            .then(formattedResults => {
                if (!currentValue) {
                    return formattedResults;
                }

                //remove already assigned values: ui-select still return them if multiple
                var selectedValues = currentValue.map(v => v.value);
                return formattedResults.filter(fr => selectedValues.indexOf(fr.value) === -1);
            });
    }
}

ReferenceRefresher.$inject = ['ReadQueries'];

export default ReferenceRefresher;
