import ListView from "../View/ListView";
import ReferenceField from "./ReferenceField";

class ReferencedListField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'referenced_list';
        this._targetReferenceField = null;
        this._targetFields = [];
        this._detailLink = false;
    }

    targetReferenceField(value) {
        if (!arguments.length) return this._targetReferenceField;
        this._targetReferenceField = value;
        return this;
    }

    targetFields(value) {
        if (!arguments.length) return this._targetFields;
        if (!this._referencedView) {
            this._referencedView = new ListView();
        }

        this._referencedView.fields(value);
        this._targetFields = value;

        return this;
    }

    getGridColumns() {
        var columns = [];
        for (let i = 0, l = this._targetFields.length ; i < l ; i++) {
            let field = this._targetFields[i];
            columns.push({
                field: field,
                label: field.label()
            });
        }

        return columns;
    }
}

export default ReferencedListField;
