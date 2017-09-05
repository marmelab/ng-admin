export default class FormController {
    constructor($scope, $state, $injector, $translate, previousState, WriteQueries, Configuration, progression, notification, view, dataStore, HttpErrorService) {
        this.$scope = $scope;
        this.$state = $state;
        this.$injector = $injector;
        this.$translate = $translate;
        this.previousState = previousState;
        this.WriteQueries = WriteQueries;
        this.dataStore = dataStore;
        this.progression = progression;
        this.notification = notification;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.fields = view.fields();
        this.config = Configuration();
        this.view = view;
        this.entity = this.view.getEntity();
        this.$scope.entry = dataStore.getFirstEntry(this.entity.uniqueId);
        this.$scope.view = view;
        this.$scope.entity = this.entity;
        this.HttpErrorService = HttpErrorService;

        // in case of entity identifier being modified
        this.originEntityId = this.$scope.entry.values[this.entity.identifier().name()];

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    validateEntry() {
        if (!this.form.$valid) {
            this.$translate('INVALID_FORM').then(text => this.notification.log(text, { addnCls: 'humane-flatty-error' }));
            return false;
        }

        try {
            this.view.validate(this.$scope.entry);
        } catch (error) {
            this.notification.log(error, { addnCls: 'humane-flatty-error' });
            return false;
        }

        return true;
    }

    submitCreation($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return Promise.reject();
        }
        const { entity, view, $state, progression, notification, $translate } = this;
        var route = entity.showView().enabled ? 'show' : 'list';
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        const fromState = $state.current.name;
        const fromParams = $state.current.params;
        const toState = $state.get(route);
        var entry = null;
        const toParams = () => ({
            entity: entity.name(),
            id: entry ? entry.identifierValue : null,
        });
        progression.start();

        return new Promise((resolve, reject) => {
            return this.WriteQueries
                .createOne(view, restEntry)
                .then(rawEntry => {
                    entry = view.mapEntry(rawEntry);
                    return entry;
                })
                .then(entry => view.onSubmitSuccess() && this.$injector.invoke(
                    view.onSubmitSuccess(),
                    view,
                    { $event, entity, entry, route, controller: this, form: this.form, progression, notification }
                ))
                .then(customHandlerReturnValue => {
                    if (customHandlerReturnValue === false) return new Promise(innerResolve => innerResolve());
                    $translate('CREATION_SUCCESS')
                        .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }))
                        .then(() => progression.done());
                    return $state.go(toState, toParams())
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    const customHandlerReturnValue = view.onSubmitError() && this.$injector.invoke(
                        view.onSubmitError(),
                        view,
                        { $event, error, entity, entry, route, controller: this, form: this.form, progression, notification }
                    );
                    if (customHandlerReturnValue === false) return;
                    progression.done();
                    this.HttpErrorService.handleError($event, toState, toParams(), fromState, fromParams, error);
                    reject();
                });
        });
    }

    submitEdition($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        const { view, $state, previousState, progression, notification, $translate } = this;
        const restEntry = this.$scope.entry.transformToRest(view.fields());
        const fromState = $state.current.name;
        const fromParams = $state.current.params;
        const toState =previousState.name;
        let entry = null;
        const toParams = previousState.params;
        progression.start();
        return new Promise((resolve, reject) => {
            return this.WriteQueries
                .updateOne(view, restEntry, this.originEntityId)
                .then(rawEntry => {
                    entry = view.mapEntry(rawEntry);
                    return entry;
                })
                .then(entry => view.onSubmitSuccess() && this.$injector.invoke(
                    view.onSubmitSuccess(),
                    view,
                    { $event, entity: this.entity, entry, controller: this, form: this.form, progression, notification }
                ))
                .then(customHandlerReturnValue => {
                    if (customHandlerReturnValue === false) return;
                    $state.go(toState, toParams)
                        .then(() => progression.done())
                        .then(() => $translate('EDITION_SUCCESS'))
                        .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }));
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    const customHandlerReturnValue = view.onSubmitError() && this.$injector.invoke(
                        view.onSubmitError(),
                        view,
                        { $event, error, entity: this.entity, entry, controller: this, form: this.form, progression, notification }
                    );
                    if (customHandlerReturnValue === false) return;
                    progression.done();
                    this.HttpErrorService.handleError($event, toState, toParams, fromState, fromParams, error);
                    reject();
                });
        });

    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
        this.$injector = undefined;
        this.$translate = undefined;
        this.previousState = undefined;
        this.WriteQueries = undefined;
        this.dataStore = undefined;
        this.view = undefined;
        this.entity = undefined;
    }
}

FormController.$inject = ['$scope', '$state', '$injector', '$translate', 'previousState', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore', 'HttpErrorService'];
