import stringUtils from "../Utils/stringUtils";
import Field from "../Field/Field";
import DashboardView from '../View/DashboardView';
import MenuView from '../View/MenuView';
import ListView from '../View/ListView';
import CreateView from '../View/CreateView';
import EditView from '../View/EditView';
import DeleteView from '../View/DeleteView';
import ShowView from '../View/ShowView';
import BatchDeleteView from '../View/BatchDeleteView';
import ExportView from '../View/ExportView';

var index = 0;

class Entity {
    constructor(name) {
        this._name = name;
        this._uniqueId = this._name + '_' + index++;
        this._baseApiUrl = null;
        this._label = null;
        this._identifierField = new Field("id");
        this._isReadOnly = false;
        this._errorMessage = null;
        this._order = 0;
        this._url = null;
        this._createMethod = null; // manually set the HTTP-method for create operation, defaults to POST
        this._updateMethod = null; // manually set the HTTP-method for update operation, defaults to PUT

        this._initViews();
    }

    get uniqueId() {
        return this._uniqueId;
    }

    get views() {
        return this._views;
    }

    label() {
        if (arguments.length) {
            this._label = arguments[0];
            return this;
        }

        if (this._label === null) {
            return stringUtils.camelCase(this._name);
        }

        return this._label;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    /**
     * @deprecated Use .views["MenuView"] instead
     */
    menuView() {
        return this._views["MenuView"];
    }

    /**
     * @deprecated Use .views["DashboardView"] instead
     */
    dashboardView() {
        return this._views["DashboardView"];
    }

    /**
     * @deprecated Use .views["ListView"] instead
     */
    listView() {
        return this._views["ListView"];
    }

    /**
     * @deprecated Use .views["CreateView"] instead
     */
    creationView() {
        return this._views["CreateView"];
    }

    /**
     * @deprecated Use .views["EditView"] instead
     */
    editionView() {
        return this._views["EditView"];
    }

    /**
     * @deprecated Use .views["DeleteView"] instead
     */
    deletionView() {
        return this._views["DeleteView"];
    }

    /**
     * @deprecated Use .views["BatchDeleteView"] instead
     */
    batchDeleteView() {
        return this._views["BatchDeleteView"];
    }

    /**
     * @deprecated Use .views["ExportView"] instead
     */
    exportView() {
        return this._views["ExportView"];
    }

    /**
     * @deprecated Use .views["ShowView"] instead
     */
    showView() {
        return this._views["ShowView"];
    }

    baseApiUrl(baseApiUrl) {
        if (!arguments.length) return this._baseApiUrl;
        this._baseApiUrl = baseApiUrl;
        return this;
    }

    createMethod(createMethod) {
        if (!arguments.length) return this._createMethod;
        this._createMethod = createMethod;
        return this;
    }

    updateMethod(updateMethod) {
        if (!arguments.length) return this._updateMethod;
        this._updateMethod = updateMethod;
        return this;
    }

    _initViews() {
        this._views = {
            "DashboardView": new DashboardView().setEntity(this),
            "MenuView": new MenuView().setEntity(this),
            "ListView": new ListView().setEntity(this),
            "CreateView": new CreateView().setEntity(this),
            "EditView": new EditView().setEntity(this),
            "DeleteView": new DeleteView().setEntity(this),
            "BatchDeleteView": new BatchDeleteView().setEntity(this),
            "ExportView": new ExportView().setEntity(this),
            "ShowView": new ShowView().setEntity(this)
        };
    }

    identifier(value) {
        if (!arguments.length) return this._identifierField;
        this._identifierField = value;
        return this;
    }

    readOnly() {
        this._isReadOnly = true;

        this._views["CreateView"].disable();
        this._views["EditView"].disable();
        this._views["DeleteView"].disable();
        this._views["BatchDeleteView"].disable();

        return this;
    }

    get isReadOnly() {
        return this._isReadOnly;
    }

    getErrorMessage(response) {
        if (typeof(this._errorMessage) === 'function') {
            return this._errorMessage(response);
        }

        return this._errorMessage;
    }

    errorMessage(errorMessage) {
        if (!arguments.length) return this._errorMessage;
        this._errorMessage = errorMessage;
        return this;
    }

    order(order) {
        if (!arguments.length) return this._order;
        this._order = order;
        return this;
    }

    url(url) {
        if (!arguments.length) return this._url;
        this._url = url;
        return this;
    }

    getUrl(viewType, identifierValue, identifierName) {
        if (typeof(this._url) === 'function') {
            return this._url(this.name(), viewType, identifierValue, identifierName);
        }

        return this._url;
    }
}

export default Entity;
