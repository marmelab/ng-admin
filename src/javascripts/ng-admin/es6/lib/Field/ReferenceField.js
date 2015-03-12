import ChoiceField from "./ChoiceField";
import ListView from "../View/ListView";

class ReferenceField extends ChoiceField {
    constructor(name) {
        super(name);
        this.entries = [];
        this._type = 'reference';
        this._targetEntity = null;
        this._targetField = null;
        this._referencedView = null;
        this._perPage = 30;
        this._filters = null;
        this._sortField = null;
        this._sortDir = null;
        this._singleApiCall = false;
        this._detailLink = true;
    }

    perPage(perPage) {
        if (!arguments.length) return this._perPage;
        this._perPage = perPage;
        return this;
    }

    targetEntity(entity) {
        if (!arguments.length) {
            return this._targetEntity;
        }

        this._targetEntity = entity;
        this._referencedView = new ListView().setEntity(entity);
        if (this._targetField) {
            this._referencedView.addField(this._targetField);
        }

        return this;
    }

    targetField(field) {
        if (!arguments.length) return this._targetField;

        this._targetField = field;
        if (!this._referencedView) {
            this._referencedView = new ListView();
        }

        this._referencedView.removeFields().addField(field);
        return this;
    }

    getReferencedView() {
        return this._referencedView.perPage(this._perPage);
    }

    filters(filters) {
        if (!arguments.length) {
            return this._filters;
        }

        this._filters = filters;

        return this;
    }

    sortField() {
        if (arguments.length) {
            this._sortField = arguments[0];
            return this;
        }

        return this._sortField;
    }

    sortDir() {
        if (arguments.length) {
            this._sortDir = arguments[0];
            return this;
        }

        return this._sortDir;
    }

    singleApiCall(singleApiCall) {
        if (!arguments.length) return this._singleApiCall;
        this._singleApiCall = singleApiCall;
        return this;
    }

    hasSingleApiCall() {
        return typeof this._singleApiCall === 'function';
    };

    getSingleApiCall(identifiers) {
        return this.hasSingleApiCall() ? this._singleApiCall(identifiers) : this._singleApiCall;
    };

    getIdentifierValues(rawValues) {
        var results = {};
        var identifierName = this._name;
        for (var i = 0, l = rawValues.length ; i < l ; i++) {
            var identifier = rawValues[i][identifierName];
            if (!identifier) {
                continue;
            }

            if (identifier instanceof Array) {
                for (var j in identifier) {
                    results[identifier[j]] = true;
                }
                continue;
            }

            results[identifier] = true;
        }

        return Object.keys(results);
    }

    getChoicesById() {
        var result = {};
        var targetEntity = this._targetEntity;
        var targetField = this._targetField.name();
        var targetIdentifier = targetEntity.identifier().name();

        for (var i = 0, l = this.entries.length ; i < l ; i++) {
            var entry = this.entries[i];
            result[entry.values[targetIdentifier]] = entry.values[targetField];
        }

        return result;
    }

    choices() {
        return this.entries.map(function(entry) {
            return {
                value: entry.values[this._targetEntity.identifier().name()],
                label: entry.values[this._targetField.name()]
            };
        }, this);
    }

    getSortFieldName() {
        return this._referencedView.name() + '.' + this._targetField.name();
    }
}

export default ReferenceField;
