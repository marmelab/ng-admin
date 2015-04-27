
class DataStore {
    constructor(name) {
        this._name = name;
        this._entry = new Map();
        this._entries = new Map();
        this._references = new Map();
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    setEntry(view, entry) {
        this._entry.set(view, entry);

        return this;
    }

    getEntry(view) {
        return this._entry.get(view);
    }

    setEntries(view, entries) {
        this._entries.set(view, entries);

        return this;
    }

    getEntries(view) {
        return this._entries.get(view);
    }

    setReferences(view, references) {
        this._references.set(view, references);

        return this;
    }

    getReferences(view) {
        return this._references.get(view);
    }
}

export default DataStore;
