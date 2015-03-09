import stringUtils from "../Utils/stringUtils";

class Field {
    constructor(name) {
        this._name = name || Math.random().toString(36).substring(7);
        this._detailLink = (name === 'id');
        this._type = "string";
        this._order = null;
        this._label = null;
        this._maps = [];
        this._attributes = {};
        this._cssClasses = null;
        this._identifier = false;
        this._validation = { required: false, minlength : 0, maxlength : 99999 };
        this._defaultValue = null;
        this._editable = true;
        this._detailLinkRoute = 'edit';
        this.dashboard = true;
        this.list = true;
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

    type() {
        return this._type;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }


    order() {
        if (arguments.length) {
            this._order = arguments[0];
            return this;
        }

        return this._order;
    }

    isDetailLink(detailLink) {
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
        if (!fn) return this._maps;
        if (typeof(fn) !== "function") {
            var type = typeof(fn);
            throw new Error(`Map argument should be a function, ${type} given.`);
        }

        this._maps.push(fn);

        return this;
    }

    hasMaps() {
        return !!this._maps.length;
    }

    attributes(attributes) {
        if (!arguments.length) {
            return this._attributes;
        }

        this._attributes = attributes;

        return this;
    }

    cssClasses(classes) {
        if (!arguments.length) return this._cssClasses;
        this._cssClasses = classes;
        return this;
    }

    getCssClasses(entry) {
        if (!this._cssClasses) {
            return '';
        }

        if (this._cssClasses.constructor === Array) {
            return this._cssClasses.join(' ');
        }

        if (typeof(this._cssClasses) === 'function') {
            return this._cssClasses(entry);
        }

        return this._cssClasses;
    }

    identifier(identifier) {
        if (!arguments.length) return this._identifier;
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

        for (var property in validation) {
            if (!validation.hasOwnProperty(property)) continue;
            if (validation[property] === null) {
                delete this._validation[property];
            } else {
                this._validation[property] = validation[property];
            }
        }

        return this;
    }

    defaultValue(defaultValue) {
        if (!arguments.length) return this._defaultValue;
        this._defaultValue = defaultValue;
        return this;
    }

    editable(editable) {
        if (!arguments.length) return this._editable;
        this._editable = editable;
        return this;
    }

    detailLinkRoute(route) {
        if (!arguments.length) return this._detailLinkRoute;
        this._detailLinkRoute = route;
        return this;
    }
}

export default Field;
