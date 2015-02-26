import Field from "./Field";

class FileField extends Field {
    constructor(name) {
        super(name);
        this._type = "file";
    }
}

export default FileField;
