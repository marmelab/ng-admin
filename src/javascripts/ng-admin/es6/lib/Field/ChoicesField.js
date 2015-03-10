import ChoiceField from "./ChoiceField";

class ChoicesField extends ChoiceField {
    constructor(name) {
        super(name);
        this._type = "choices";
    }
}

export default ChoicesField;
