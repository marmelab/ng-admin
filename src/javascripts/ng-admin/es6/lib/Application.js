import Factory from "./Factory";

class Application {
    constructor(title, baseApiUrl) {
        this._baseApiUrl = baseApiUrl;
        this._customTemplate = function(viewName) {};

        this._factory = new Factory();

        this._title = title;
        this._layout = false;
        this._entities = [];
    }

    get entities() {
        return this._entities;
    }

    getViewsOfType(type) {
        return this._entities.map(entity => entity.views[type]);
    }

    getRouteFor(view, entityId) {
        var entity = view.entity;
        var baseApiUrl = entity.baseApiUrl() || this.baseApiUrl();

        var url = baseApiUrl + entity.name() + (entityId ? '/' + entityId : '');

        // Add baseUrl for relative URL
        if (!/^(?:[a-z]+:)?\/\//.test(url)) {
            url = baseApiUrl + url;
        }

        return url;
    }

    layout() {
        if (arguments.length) {
            this._layout = arguments[0];
            return this;
        }

        return this._layout;
    }

    title() {
        if (arguments.length) {
            this._title= arguments[0];
            return this;
        }

        return this._title;
    }

    customTemplate(customTemplate) {
        if (!arguments.length) {
            return this._customTemplate;
        }

        this._customTemplate = customTemplate;

        return this;
    }

    baseApiUrl() {
        if (arguments.length) {
            this._baseApiUrl = arguments[0];
            return this;
        }

        return this._baseApiUrl;
    }

    /** @deprecated use entities collection directly */
    addEntity(entity) {
        if (!entity) {
            throw new Error("No entity given");
        }

        this._entities.push(entity);

        return this;
    }

    getViewByEntityAndType(entityName, type) {
        return this._entities
            .filter(e => e.name() === entityName)[0]
            .views[type];
    }
}

export default Application;
