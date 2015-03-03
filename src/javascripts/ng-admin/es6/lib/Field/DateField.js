import Field from "./Field";

class DateField extends Field {
    constructor(name) {
        super(name);
        this._format = 'yyyy-MM-dd';
        this._parse = function(date) { return date; };
        this._type = "date";
    }

    format(value) {
        if (!arguments.length) return this._format;
        this._format = value;
        return this;
    }

    parse(value) {
        if (!arguments.length) return this._parse;
        this._parse = value;
        return this;
    }
}

export default DateField;
