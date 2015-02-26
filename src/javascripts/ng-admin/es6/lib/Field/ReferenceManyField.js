import ReferenceField from "./ReferenceField";

class ReferenceManyField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'reference_many';
    }
}

export default ReferenceManyField;
