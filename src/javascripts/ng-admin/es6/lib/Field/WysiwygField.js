import Field from "./Field";

class WysiwygField extends Field {
    constructor(name) {
        super(name);
        this._type = "wysiwyg";
        this._stripTags = false;
        this._sanitize = true;
    }

    stripTags(value) {
        if (!arguments.length) return this._stripTags;
        this._stripTags = value;
        return this;
    }
    
    sanitize(value) {
        if (!arguments.length) return this._sanitize;
        this._sanitize = value;
        return this;
    }
}

export default WysiwygField;
