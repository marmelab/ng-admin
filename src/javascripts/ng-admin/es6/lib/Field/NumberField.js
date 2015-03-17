import Field from "./Field";

class NumberField extends Field {
    constructor(name) {
        super(name);
        this._type = "number";
        this._format = undefined;
    }

    /**
     * Specify format pattern for number to string conversion. 
     *
     * Based on NumeralJs, which uses a syntax similar to Excel.
     *
     * {@link} http://numeraljs.com/
     * {@link} https://github.com/baumandm/angular-numeraljs
     * {@example}
     *
     *     nga.field('height', 'number').format('$0,0.00');
     */
    format(value) {
        if (!arguments.length) return this._format;
        this._format = value;
        return this;
    }

    fractionSize(decimals) {
        console.warn('NumberField.fractionSize() is deprecated, use NumberField.format() instead');
        this.format('0.' + '0'.repeat(decimals));
        return this;
    }

}

export default NumberField;
