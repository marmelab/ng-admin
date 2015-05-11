class Entry {
    constructor(entityName, values, identifierValue) {
        this._entityName = entityName;
        this.values = values || {};
        this._identifierValue = identifierValue;
        this.listValues = {};
    }

    get entityName() {
        return this._entityName;
    }

    get identifierValue() {
        return this._identifierValue;
    }

    static mapFromRest(entityName, identifier, fields, restEntry) {
        if (!restEntry) {
            return new Entry(entityName);
        }

        var identifierValue = null;

        fields.forEach(function (field) {
            var fieldName = field.name();
            if (fieldName in restEntry) {
                restEntry[fieldName] = field.getMappedValue(restEntry[fieldName], restEntry);
            }
        });

        // Add identifier value
        if (identifier) {
            identifierValue = restEntry[identifier.name()];
        }

        return new Entry(entityName, restEntry, identifierValue);
    }
}

export default Entry;
