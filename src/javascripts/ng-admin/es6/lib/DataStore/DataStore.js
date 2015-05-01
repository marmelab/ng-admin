import Entry from "../Entry";

class DataStore {
    constructor() {
        this._entries = {};
    }

    setEntries(name, entries) {
        this._entries[name] = entries;

        return this;
    }

    addEntry(name, entry) {
        if (!(name in this._entries)) {
            this._entries[name] = [];
        }

        this._entries[name].push(entry);
    }

    getEntries(name) {
        return this._entries[name] || [];
    }

    getFirstEntry(name) {
        return this._entries[name][0];
    }

    getChoices(field) {
        var identifier = field.targetEntity().identifier().name();
        var name = field.targetField().name();

        return this.getEntries(field.targetEntity().uniqueId + '_choices').map(function(entry) {
            return {
                value: entry.values[identifier],
                label: entry.values[name]
            };
        });
    }

    createEntry(entityName, identifier, fields) {
        var entry = new Entry.mapFromRest(entityName, identifier, fields, {});

        fields.forEach(function (field) {
            entry.values[field.name()] = field.defaultValue();
        });

        return entry;
    }

    mapEntry(entityName, identifier, fields, restEntry) {
        var entry = new Entry.mapFromRest(entityName, identifier, fields, restEntry);

        return entry;
    }

    mapEntries(entityName, identifier, fields, restEntries) {
        return restEntries.map(e => this.mapEntry(entityName, identifier, fields, e));
    }

    fillReferencesValuesFromCollection(collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        var i, l;

        for (i = 0, l = collection.length; i < l; i++) {
            collection[i] = this.fillReferencesValuesFromEntry(collection[i], referencedValues, fillSimpleReference);
        }

        return collection;
    }

    fillReferencesValuesFromEntry(entry, referencedValues, fillSimpleReference) {
        var reference,
            referenceField,
            choices,
            entries,
            identifier,
            id,
            i;

        for (referenceField in referencedValues) {
            reference = referencedValues[referenceField];
            choices = this.getReferenceChoicesById(reference);
            entries = [];
            identifier = reference.getMappedValue(entry.values[referenceField], entry.values);

            if (reference.type() === 'reference_many') {
                for (i in identifier) {
                    id = identifier[i];
                    entries.push(choices[id]);
                }

                entry.listValues[referenceField] = entries;
            } else if (fillSimpleReference && identifier && identifier in choices) {
                entry.listValues[referenceField] = reference.getMappedValue(choices[identifier], entry.values);
            }
        }

        return entry;
    }

    getReferenceChoicesById(field) {
        var result = {};
        var targetField = field.targetField().name();
        var targetIdentifier = field.targetEntity().identifier().name();
        var entries = this.getEntries(field.targetEntity().uniqueId + '_values');

        for (var i = 0, l = entries.length ; i < l ; i++) {
            var entry = entries[i];
            result[entry.values[targetIdentifier]] = entry.values[targetField];
        }

        return result;
    }
}

export default DataStore;
