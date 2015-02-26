import Field from "./Field";

class EmailField extends Field {
    constructor(name) {
        super(name);
        this._type = "email";
    }
}

export default EmailField;
