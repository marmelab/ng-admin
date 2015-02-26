import Entry from "../Entry";

class View {
    constructor(entity) {
        this.entity = entity;

        this._title = null;
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

    /** @deprecated */
    title() {
        if (arguments.length) {
            this._title = arguments[0];
            return this;
        }

        return this._title;
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

    fields() {
        if (arguments.length) {
            this._fields = arguments[0];
            return this;
        }

        return this._fields;
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
}

export default View;
