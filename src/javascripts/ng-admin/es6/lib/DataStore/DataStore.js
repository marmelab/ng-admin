import Entry from "../Entry";

class DataStore {
    constructor() {
        this._entries = new Map();
    }

    setEntries(view, entries, referencedValues, fillSimpleReference) {
        if (referencedValues) {
            entries = this.fillReferencesValuesFromCollection(entries, referencedValues, fillSimpleReference);
        }

        this._entries.set(view, entries);

        return this;
    }

    getEntries(view) {
        return this._entries.get(view) || [];
    }

    getChoices(field) {
        var view = field.getReferencedView();
        var identifier = field.targetEntity().identifier().name();
        var name = field.targetField().name();

        return this.getEntries(view).map(function(entry) {
            return {
                value: entry.values[identifier],
                label: entry.values[name]
            };
        });
    }

    createEntry(view) {
        var entry = new Entry.mapFromRest(view, {});

        view.getFields().forEach(function (field) {
            entry.values[field.name()] = field.defaultValue();
        });

        return entry;
    }

    mapEntry(view, restEntry) {
        var entry = new Entry.mapFromRest(view, restEntry);

        return entry;
    }

    mapEntries(view, restEntries) {
        return restEntries.map(e => this.mapEntry(view, e));
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
        var entries = this.getEntries(field.getReferencedView());

        for (var i = 0, l = entries.length ; i < l ; i++) {
            var entry = entries[i];
            result[entry.values[targetIdentifier]] = entry.values[targetField];
        }

        return result;
    }
}

export default DataStore;
