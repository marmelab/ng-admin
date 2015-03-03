import Entry from "../Entry";
import arrayUtils from "../Utils/arrayUtils";

class View {
    constructor(entity) {
        this.entity = entity;

        this._actions = null;
        this._title = false;
        this._description = null;
        this._template = null;

        this._enabled = true;
        this._fields = [];
        this._type = null;
        this._name = entity.name();
        this._order = 0;
    }

    get enabled() {
        return this._enabled;
    }

    title(title) {
        if (!arguments.length) return this._title;
        this._title = title;
        return this;
    }

    /** @deprecated */
    description() {
        if (arguments.length) {
            this._description = arguments[0];
            return this;
        }

        return this._description;
    }

    /** @deprecated */
    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    disable() {
        this._enabled = false;
    }

    enable() {
        this._enabled = true;
    }

    /**
     * @deprecated Use getter "enabled" instead
     */
    isEnabled() {
        return this._enabled;
    }

    /**
     * @deprecated Use getter "entity" instead
     */
    getEntity() {
        return this.entity;
    }

    fields(fields) {
        if (!arguments.length) return this._fields;
        this._fields = arrayUtils.flatten(fields);
        return this;
    }

    get type() {
        return this._type;
    }

    order() {
        if (arguments.length) {
            this._order = arguments[0];
            return this;
        }

        return this._order;
    }

    getReferences() {
        var references = {};
        var referenceFields = this._fields.filter(field => field.type() === 'reference' || field.type() === 'reference_many');
        for (var key in referenceFields) {
            let referencedField = referenceFields[key];
            references[referencedField.name()] = referencedField;
        }

        return references;
    }

    getReferencedLists() {
        return this._fields.filter(f => f.type() === 'referenced_list');
    };

    mapEntry(restEntry) {
        return new Entry.mapFromRest(this, restEntry);
    }

    mapEntries(restEntries) {
        return restEntries.map(e => this.mapEntry(e));
    }

    template(template) {
        if (!arguments.length) {
            return this._template;
        }

        this._template = template;

        return this;
    }

    identifier() {
        var identifier;

        var fields = this._fields;
        for (var i in fields) {
            if (fields[i].identifier()) {
                identifier = fields[i];
                break;
            }
        }

        // No identifier fields on this view, try to find it on other view
        if (!identifier) {
            identifier = this.entity.identifier();
        }

        if (!arguments.length) {
            return identifier;
        }

        return this;
    }

    actions(actions) {
        if (!arguments.length) return this._actions;
        this._actions = actions;
        return this;
    }

    processFieldsDefaultValue(entry) {
        for (var i in this._fields) {
            var field = this._fields[i];
            entry.values[field.name()] = field.defaultValue();
        }

        return this;
    }

    removeFields() {
        this._fields = [];
        return this;
    }

    getFields() {
        return this._fields;
    }
}

export default View;
