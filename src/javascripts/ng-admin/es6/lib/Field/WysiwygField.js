import Field from "./Field";

class WysiwygField extends Field {
    constructor(name) {
        super(name);
        this._type = "wysiwyg";
        this._stripTags = false;
    }

    stripTags(value) {
        if (!arguments.length) return this._stripTags;
        this._stripTags = value;
        return this;
    }
}

export default WysiwygField;
