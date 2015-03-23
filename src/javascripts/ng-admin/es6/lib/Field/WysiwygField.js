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
	
	sanitize() {
		if (arguments.length) {
			this._sanitize = arguments[0];
			return this;
		}
		
		return this._sanitize;
	}
}

export default WysiwygField;
