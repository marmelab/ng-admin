import Field from "./Field";

class ReferencedListField extends Field {
    constructor(name) {
        super(name);
        this._type = 'referenced_list';
    }
}

export default ReferencedListField;
