import NumberField from "./NumberField";

class FloatField extends NumberField {
    constructor(name) {
        super(name);
        this._type = 'float';
        this._format = '0.000';
    }
}

export default FloatField;
