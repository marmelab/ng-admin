import Field from "./Field";

class ChoiceField extends Field {
    constructor(name) {
        super(name);
        this._type = "choice";
        this._choices = [];
        this._choicesFunc = null;
    }

    choices(choices) {
        if (!arguments.length) return this._choices;
        if (typeof(choices) == 'function') {
            this._choicesFunc = choices;
        } else {
            this._choices = choices;
        }
 
        return this;
    }

    getChoices(entry) {
        if (this._choicesFunc != null){
            return this._choicesFunc(entry);
        }

        return this._choices;
    }

    getLabelForChoice(value) {
        var choice = this._choices.filter(c => c.value == value).pop();
        return choice ? choice.label : null;
    }
}

export default ChoiceField;
