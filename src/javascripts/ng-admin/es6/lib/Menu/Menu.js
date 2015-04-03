import Entity from '../Entity/Entity'

function alwaysFalse() {
    return false;
}

var uuid = 0;

class Menu {
    constructor() {
        this._link = null;
        this._activeFunc = alwaysFalse;
        this._title = null;
        this._icon = false;
        this._children = [];
        this._template = false;
        this.uuid = uuid++;
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
            if (this._activeFunc == alwaysFalse) {
                this._activeFunc = url => url.indexOf(this._link) === 0;
            }
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

    isChildActive(url) {
        return this.isActive(url) || (this.children().filter(menu => menu.isChildActive(url)).length > 0);
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

    getChildByTitle(title) {
        return this.children().filter(child => child.title() == title).pop();
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

    populateFromEntity(entity) {
        if (!(entity instanceof Entity)) {
            throw new Error('populateFromEntity() only accepts an Entity parameter');
        }
        this.title(entity.label());
        this.active(path => path.indexOf(`/${entity.name()}/`) === 0 );
        this.link(`/${entity.name()}/list`);
        // deprecated
        this.icon(entity.menuView().icon());
        return this;
    }
}

export default Menu;
