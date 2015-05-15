import Field from "./Field";

class ReferenceField extends Field {
    constructor(name) {
        super(name);
        this._type = 'reference';
        this._targetEntity = null;
        this._targetField = null;
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

    datagridName() {
        return this._targetEntity.name() + '_' + this._type;
    }

    targetEntity(entity) {
        if (!arguments.length) {
            return this._targetEntity;
        }
        this._targetEntity = entity;

        return this;
    }

    targetField(field) {
        if (!arguments.length) return this._targetField;
        this._targetField = field;

        return this;
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
    }

    getSingleApiCall(identifiers) {
        return this.hasSingleApiCall() ? this._singleApiCall(identifiers) : this._singleApiCall;
    }

    getIdentifierValues(rawValues) {
        let results = {};
        let identifierName = this._name;
        for (let i = 0, l = rawValues.length ; i < l ; i++) {
            let identifier = rawValues[i][identifierName];
            if (!identifier) {
                continue;
            }

            if (identifier instanceof Array) {
                for (let j in identifier) {
                    results[identifier[j]] = true;
                }
                continue;
            }

            results[identifier] = true;
        }

        return Object.keys(results);
    }

    getSortFieldName() {
        return this._targetEntity.name() + '_ListView.' + (this.sortField() || this._targetField.name());
    }
}

export default ReferenceField;
