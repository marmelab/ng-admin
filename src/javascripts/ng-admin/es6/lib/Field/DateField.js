import Field from "./Field";

class DateField extends Field {
    constructor(name) {
        super(name);
        this._type = "date";
    }
}

export default DateField;
