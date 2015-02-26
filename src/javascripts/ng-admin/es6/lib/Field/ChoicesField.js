import Field from "./Field";

class ChoicesField extends Field {
    constructor(name) {
        super(name);
        this._type = "choices";
    }
}

export default ChoicesField;
