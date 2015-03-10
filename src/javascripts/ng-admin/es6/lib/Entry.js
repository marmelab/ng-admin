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

    static mapFromRest(view, restEntry) {
        if (!restEntry) {
            return new Entry(view.entity.name());
        }

        var identifier = view.identifier();
        var identifierValue = null;

        var values = restEntry;
        for (var fieldName in view.fields()) {
            var field = view.fields()[fieldName];
            if (field.name() in restEntry) {
                values[fieldName] = field.getMappedValue(restEntry[field.name()], restEntry);
            }
        }

        // Add identifier value
        if (identifier) {
            identifierValue = restEntry[identifier.name()];
        }

        return new Entry(view.entity.name(), restEntry, identifierValue);
    }
}

export default Entry;
