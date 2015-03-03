import ReferenceField from "./ReferenceField";

class ReferencedListField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'referenced_list';
        this._targetReferenceField = null;
        this._targetFields = [];
    }

    targetReferenceField(value) {
        if (!arguments.length) return this._targetReferenceField;
        this._targetReferenceField = value;
        return this;
    }

    targetFields(value) {
        if (!arguments.length) return this._targetFields;
        this._referencedView.fields(value);
        this._targetFields = value;

        return this;
    }
}

export default ReferencedListField;
