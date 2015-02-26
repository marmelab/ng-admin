import Field from "./Field";

class TextField extends Field {
    constructor(name) {
        super(name);
        this._type = "text";
    }
}

export default TextField;
