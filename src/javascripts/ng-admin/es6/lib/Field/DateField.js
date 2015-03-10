import Field from "./Field";

class DateField extends Field {
    constructor(name) {
        super(name);
        this._format = 'yyyy-MM-dd';
        this._parse = function(date) {
            if (date instanceof Date) {
                // the datepicker returns a JS Date object, with hours, minutes and timezone
                // in order to convert it back to date, we must remove the timezone, then
                // remove hours and minutes
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                var dateString = date.toJSON();
                return dateString ? dateString.substr(0,10) : null;
            }
        };
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
