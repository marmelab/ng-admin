import Field from "./Field";

class TemplateField extends Field {
    constructor(name) {
        super(name);
        this._template = function() { return ''; };
        this._type = "template";
    }

    getTemplateValue(data) {
        if (typeof(this._template) === 'function') {
            return this._template(data);
        }

        return this._template;
    }

    template() {
        if (arguments.length) {
            this._template = arguments[0];
            return this;
        }

        return this._template;
    }
}

export default TemplateField;
