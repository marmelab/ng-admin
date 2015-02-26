import Field from "./Field";

class NumberField extends Field {
    constructor(name) {
        super(name);
        this._type = "number";
    }
}

export default NumberField;
