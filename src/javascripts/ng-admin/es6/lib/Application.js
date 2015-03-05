class Application {
    constructor(title, baseApiUrl) {
        this._baseApiUrl = baseApiUrl;
        this._customTemplate = function(viewName) {};

        this._title = title;
        this._layout = false;
        this._entities = [];
        this._errorMessage = this.defaultErrorMessage;
    }

    defaultErrorMessage(response) {
        var body = response.data;

        if (typeof body === 'object') {
            body = JSON.stringify(body);
        }

        return 'Oops, an error occured : (code: ' + response.status + ') ' + body;
    }

    get entities() {
        return this._entities;
    }

    getViewsOfType(type) {
        return this._entities.map(entity => entity.views[type]);
    }

    getRouteFor(view, entityId) {
        var entity = view.getEntity(),
            baseApiUrl = entity.baseApiUrl() || this.baseApiUrl(),
            url = view.getUrl(entityId) || entity.getUrl(view, entityId);

        // If the view or the entity don't define the url, retrieve it from the baseURL of the entity or the app
        if (!url) {
            url = baseApiUrl + entity.name();
            if (entityId) {
                url += '/' + entityId;
            }
        }

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

    addEntity(entity) {
        if (!entity) {
            throw new Error("No entity given");
        }

        this._entities.push(entity);

        return this;
    }

    getEntity(entityName) {
        var foundEntity = this._entities.filter(e => e.name() === entityName)[0];
        if (!foundEntity) {
            throw new Error(`Unable to find entity "${entityName}"`);
        }

        return foundEntity;
    }

    hasEntity(fieldName) {
        return !!(this._entities.filter(f => f.name() === fieldName).length);
    }

    getViewByEntityAndType(entityName, type) {
        return this._entities
            .filter(e => e.name() === entityName)[0]
            .views[type];
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

    getErrorMessageFor(view, response) {
        return (
            view.getErrorMessage(response)
            || view.getEntity().getErrorMessage(response)
            || this.getErrorMessage(response)
        );
    }

    getEntityNames() {
        return this.entities.map(f => f.name());
    }
}

export default Application;
