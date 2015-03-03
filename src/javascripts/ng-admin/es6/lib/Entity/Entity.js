import stringUtils from "../Utils/stringUtils";
import Field from "../Field/Field";
import DashboardView from '../View/DashboardView';
import MenuView from '../View/MenuView';
import ListView from '../View/ListView';
import CreateView from '../View/CreateView';
import EditionView from '../View/EditionView';
import DeletionView from '../View/DeletionView';

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

    /** @deprecated */
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

    /**
     * @deprecated
     */
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
     * @deprecated Use .views["EditionView"] instead
     */
    editionView() {
        return this._views["EditionView"];
    }

    /**
     * @deprecated Use .views["DeletionView"] instead
     */
    deletionView() {
        return this._views["DeletionView"];
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
            "EditionView": new EditionView(this),
            "DeletionView": new DeletionView(this)
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
        this._views["EditionView"].disable();
        this._views["DeletionView"].disable();

        return this;
    }

    get isReadOnly() {
        return this._isReadOnly;
    }
}

export default Entity;
