import View from "./View";

class MenuView extends View {
    constructor(name) {
        super(name);
        this._type = 'MenuView';
        this._icon = null;
    }

    icon() {
        if (arguments.length) {
            console.warn('entity.menuView() is deprecated. Please use the Menu class instead');
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
