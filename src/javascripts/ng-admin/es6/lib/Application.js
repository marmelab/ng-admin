class Application {
    constructor(title) {
        this._baseApiUrl = null;
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

    layout(layout) {
        if (!arguments.length) return this._layout;
        this._layout = layout;
        return this;
    }

    title(title) {
        if (!arguments.length) return this._title;
        this._title = title;
        return this;
    }

    customTemplate(customTemplate) {
        if (!arguments.length) return this._customTemplate;
        this._customTemplate = customTemplate;
        return this;
    }

    baseApiUrl(url) {
        if (!arguments.length) return this._baseApiUrl;
        this._baseApiUrl = url;
        return this;
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
