import Field from "./Field";

class PasswordField extends Field {
    constructor(name) {
        super(name);
        this._type = "password";
    }
}

export default PasswordField;
