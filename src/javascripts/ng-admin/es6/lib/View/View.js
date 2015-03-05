import Entry from "../Entry";
import arrayUtils from "../Utils/arrayUtils";

class View {
    constructor(entity) {
        this.entity = entity;

        this._actions = null;
        this._title = false;
        this._description = '';
        this._template = null;

        this._enabled = true;
        this._fields = [];
        this._type = null;
        this._name = entity ? entity.name() : null;
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

    description() {
        if (arguments.length) {
            this._description = arguments[0];
            return this;
        }

        return this._description;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name + '_' + this._type;
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

    /**
     * @deprecated Specify entity at view creation or use "entity" setter instead
     */
    setEntity(entity) {
        this.entity = entity;
        this._name = entity.name() + '_' + this._type;

        return this;
    }

    fields() {
        if (!arguments.length) return View._indexFieldsByName(this._fields);

        for (let i = 0, c = arguments.length ; i < c ; i++) {
            let argument = arguments[i];
            if (typeof(argument) === 'object') {
                if (argument.constructor.name === 'Field') {
                    // simple field
                    this._fields.push(argument);
                } else {
                    // collection of fields
                    for (var fieldName in argument) {
                        this._fields.push(argument[fieldName]);
                    }
                }
            } else {
                // Array of fields
                this._fields = arrayUtils.flatten(argument);
            }
        }

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

    getFields(asArray) {
        if (asArray) {
            return this._fields;
        }

        return View._indexFieldsByName(this._fields);
    }

    getField(fieldName) {
        return this._fields.filter(f => f.name() === fieldName)[0];
    }

    getFieldsOfType(type) {
        var fields = this._fields.filter(f => f.type() === type);
        return View._indexFieldsByName(fields);
    }

    static _indexFieldsByName(fields) {
        var result = {};
        for(let i = 0, c = fields.length ; i < c ; i++) {
            var field = fields[i];
            result[field.name()] = field;
        }

        return result;
    }

    addField(field) {
        if (field.order() === null) {
            field.order(this._fields.length);
        }

        this._fields.push(field);
        return this;
    }
}

export default View;
