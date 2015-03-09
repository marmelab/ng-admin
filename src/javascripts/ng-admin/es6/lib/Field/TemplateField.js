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

    template(template) {
        if (!arguments.length) return this._template;
        this._template = template;
        return this;
    }
}

export default TemplateField;
