import Field from "./Field";

class FileField extends Field {
    constructor(name) {
        super(name);
        this._type = "file";
        this._uploadInformation = {
            url: '/upload',
            accept: '*'
        };
    }

    uploadInformation(information) {
        if (!arguments.length) return this._uploadInformation;
        this._uploadInformation = information;
        return this;
    }
}

export default FileField;
