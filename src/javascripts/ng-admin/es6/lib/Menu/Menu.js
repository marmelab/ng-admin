class Menu {
    constructor() {
        this._link = null;
        this._activeFunc = () => false;
        this._title = null;
        this._icon = null;
        this._children = [];
        this._template = null;
    }

    title() {
        if (arguments.length) {
            this._title = arguments[0];
            return this;
        }
        return this._title;
    }

    isLink() {
        return !!this._link;
    }

    link() {
        if (arguments.length) {
            this._link = arguments[0];
            this._activeFunc = (url) => url.indexOf(this._link) === 0;
            return this;
        }
        return this._link;
    }

    active(activeFunc) {
        if (arguments.length) {
            this._activeFunc = arguments[0];
            return this;
        }
        return this._activeFunc;
    }

    isActive(url) {
        return this._activeFunc(url);
    }

    addChild(child) {
        if (!(child instanceof Menu)) {
            throw new Error('Only Menu instances are accepted as children of a Menu');
        }
        this._children.push(child);
        return this;
    }

    hasChild() {
        return this._children.length > 0;
    }

    children() {
        if (arguments.length) {
            this._children = arguments[0];
            return this;
        }
        return this._children;
    }

    icon() {
        if (arguments.length) {
            this._icon = arguments[0];
            return this;
        }
        return this._icon;
    }

    template() {
        if (arguments.length) {
            this._template = arguments[0];
            return this;
        }
        return this._template;
    }

}

export default Menu;
