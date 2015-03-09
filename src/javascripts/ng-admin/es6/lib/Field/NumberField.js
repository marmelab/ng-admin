import Field from "./Field";

class NumberField extends Field {
    constructor(name) {
        super(name);
        this._type = "number";
        this._fractionSize = undefined;
    }

    /**
     * Number of decimal places to round the number to. If this is not provided,
     * then the fraction size is computed from the current locale's number formatting pattern.
     * In the case of the default locale, it will be 3.
     *
     * {@example}
     *
     *     nga.field('height', 'number').fractionSize(2);
     */
    fractionSize(value) {
        if (!arguments.length) return this._fractionSize;
        this._fractionSize = value;
        return this;
    };
}

export default NumberField;
