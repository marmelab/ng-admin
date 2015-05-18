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
        let entries = this.getEntries(name);

        return entries.length ? entries[0] : null;
    }

    getChoices(field) {
        let identifier = field.targetEntity().identifier().name();
        let name = field.targetField().name();

        return this.getEntries(field.targetEntity().uniqueId + '_choices').map(function(entry) {
            return {
                value: entry.values[identifier],
                label: entry.values[name]
            };
        });
    }

    createEntry(entityName, identifier, fields) {
        let entry = new Entry.mapFromRest(entityName, identifier, fields, {});

        fields.forEach(function (field) {
            entry.values[field.name()] = field.defaultValue();
        });

        return entry;
    }

    mapEntry(entityName, identifier, fields, restEntry) {
        let entry = new Entry.mapFromRest(entityName, identifier, fields, restEntry);

        return entry;
    }

    mapEntries(entityName, identifier, fields, restEntries) {
        return restEntries.map(e => this.mapEntry(entityName, identifier, fields, e));
    }

    fillReferencesValuesFromCollection(collection, referencedValues, fillSimpleReference) {
        fillSimpleReference = typeof (fillSimpleReference) === 'undefined' ? false : fillSimpleReference;

        for (let i = 0, l = collection.length; i < l; i++) {
            collection[i] = this.fillReferencesValuesFromEntry(collection[i], referencedValues, fillSimpleReference);
        }

        return collection;
    }

    fillReferencesValuesFromEntry(entry, referencedValues, fillSimpleReference) {
        for (let referenceField in referencedValues) {
            let reference = referencedValues[referenceField],
                choices = this.getReferenceChoicesById(reference),
                entries = [],
                identifier = reference.getMappedValue(entry.values[referenceField], entry.values);

            if (reference.type() === 'reference_many') {
                for (let i in identifier) {
                    let id = identifier[i];
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
        let result = {},
            targetField = field.targetField().name(),
            targetIdentifier = field.targetEntity().identifier().name(),
            entries = this.getEntries(field.targetEntity().uniqueId + '_values');

        for (let i = 0, l = entries.length ; i < l ; i++) {
            let entry = entries[i];
            result[entry.values[targetIdentifier]] = entry.values[targetField];
        }

        return result;
    }
}

export default DataStore;
