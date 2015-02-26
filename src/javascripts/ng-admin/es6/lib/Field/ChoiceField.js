import Field from "./Field";

class ChoiceField extends Field {
    constructor(name) {
        super(name);
        this._type = "choice";
    }
}

export default ChoiceField;
