import stringUtils from "../Utils/stringUtils";

class Field {
    constructor(name) {
        this._name = name;
        this._detailLink = null;
        this._type = "string";
        this._order = 0;
        this._label = null;
        this._maps = [];
        this._attributes = {};
        this._format = null;
        this._cssClasses = null;
        this._identifier = false;
        this._validation = {};
        this._defaultValue = null;
        this._editable = true;

        this._choices = [];
    }

    label() {
        if (arguments.length) {
            this._label = arguments[0];
            return this;
        }

        if (this._label === null) {
            return stringUtils.camelCase(this._name);
        }

        return this._label;
    }

    /** @deprecated */
    type() {
        if (arguments.length) {
            this._type = arguments[0];
            return this;
        }

        return this._type;
    }

    /** @deprecated */
    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }


    /** @deprecated */
    order() {
        if (arguments.length) {
            this._order = arguments[0];
            return this;
        }

        return this._order;
    }

    isDetailLink() {
        if (arguments.length) {
            this._detailLink = arguments[0];
            return this;
        }

        if (this._detailLink === null) {
            return this._name === 'id';
        }

        return this._detailLink;
    }

    set detailLink(isDetailLink) {
        return this._detailLink = isDetailLink;
    }

    map(fn) {
        if (typeof(fn) !== "function") {
            var type = typeof(fn);
            throw new Error(`Map argument should be a function, ${type} given.`);
        }

        this._maps.push(fn);

        return this;
    }

    attributes(attributes) {
        if (!arguments.length) {
            return this._attributes;
        }

        this._attributes = attributes;

        return this;
    }

    format(format) {
        if (!arguments.length) {
            return this._format;
        }

        this._format = format;

        return this;
    }

    cssClasses(classes) {
        if (!arguments.length) {
            return this._cssClasses;
        }

        this._cssClasses = classes;

        return this;
    }

    getCssClasses(entry) {
        if (!this._cssClasses) {
            return;
        }

        if (typeof(this._cssClasses) === 'function') {
            return this._cssClasses(entry);
        }

        if (this._cssClasses.constructor === Array) {
            return this._cssClasses.join(' ');
        }

        return this._cssClasses;
    }

    identifier(identifier) {
        if (!arguments.length) {
            return this._identifier;
        }

        this._identifier = identifier;

        return this;
    }

    getMappedValue(value, entry) {
        for (var i in this._maps) {
            value = this._maps[i](value, entry);
        }

        return value;
    }

    validation(validation) {
        if (!arguments.length) {
            return this._validation;
        }

        this._validation = validation;

        return this;
    }

    choices(choices) {
        if (!arguments.length) {
            return this._choices;
        }

        this._choices = choices;

        return this;
    }

    defaultValue(defaultValue) {
        if (!arguments.length) return this._defaultValue;
        this.defaultValue = defaultValue;
        return this;
    }

    editable(editable) {
        if (!arguments.length) return this._editable;
        this._editable = editable;
        return this;
    }
}

export default Field;
