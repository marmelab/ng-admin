import View from "./View";

class MenuView extends View {
    constructor(entity) {
        super(entity);
        this._type = 'MenuView';
        this._icon = null;
    }

    /**
     * @deprecated
     */
    icon() {
        if (arguments.length) {
            this._icon = arguments[0];
            return this;
        }

        if (this._icon === null) {
            return '<span class="glyphicon glyphicon-list"></span>';
        }

        return this._icon;
    }
}

export default MenuView;
