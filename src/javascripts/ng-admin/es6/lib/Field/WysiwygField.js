import Field from "./Field";

class WysiwygField extends Field {
    constructor(name) {
        super(name);
        this._type = "wysiwyg";
    }
}

export default WysiwygField;
