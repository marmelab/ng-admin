import Field from "./Field";

class ChoiceField extends Field {
    constructor(name) {
        super(name);
        this._type = "choice";
        this._choices = [];
    }

    choices(choices) {
        if (!arguments.length) return this._choices;
        this._choices = choices;
        return this;
    }

    getLabelForChoice(value) {
        var choice = this._choices.filter(c => c.value == value).pop();
        return choice ? choice.label : null;
    }
}

export default ChoiceField;
