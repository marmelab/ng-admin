import Field from "./Field";

class BooleanField extends Field {
    constructor(name) {
        super(name);
        this._type = "boolean";
    }
}

export default BooleanField;
