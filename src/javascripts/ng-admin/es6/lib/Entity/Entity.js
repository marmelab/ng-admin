import stringUtils from "../Utils/stringUtils";
import Field from "../Field/Field";
import DashboardView from '../View/DashboardView';
import MenuView from '../View/MenuView';
import ListView from '../View/ListView';
import CreateView from '../View/CreateView';
import EditView from '../View/EditView';
import DeleteView from '../View/DeleteView';
import ShowView from '../View/ShowView';

class Entity {
    constructor(name) {
        this._name = name;
        this._baseApiUrl = null;
        this._label = null;
        this._identifierField = new Field("id");
        this._isReadOnly = false;

        this._initViews();
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
     * @deprecated Use .views["ShowView"] instead
     */
    showView() {
        return this._views["ShowView"];
    }

    baseApiUrl() {
        if (arguments.length) {
            this._baseApiUrl = arguments[0];
            return this;
        }

        return this._baseApiUrl;
    }

    _initViews() {
        this._views = {
            "DashboardView": new DashboardView(this),
            "MenuView": new MenuView(this),
            "ListView": new ListView(this),
            "CreateView": new CreateView(this),
            "EditView": new EditView(this),
            "DeleteView": new DeleteView(this),
            "ShowView": new ShowView(this)
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

        return this;
    }

    get isReadOnly() {
        return this._isReadOnly;
    }
}

export default Entity;
