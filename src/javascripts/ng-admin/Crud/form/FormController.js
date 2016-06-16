export default class FormController {
    constructor($scope, $state, $injector, $translate, previousState, WriteQueries, Configuration, progression, notification, view, dataStore) {
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
            return;
        }
        const { entity, view, $state, progression, notification, $translate } = this;
        var route = entity.showView().enabled ? 'show' : 'list';
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        var entry = null;
        progression.start();
        this.WriteQueries
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
            .then(customHandlerReturnValue => (customHandlerReturnValue === false) ?
                new Promise(resolve => resolve()) :
                $state.go(this.$state.get(route), { entity: entity.name(), id: entry.identifierValue })
            )
            .then(() => progression.done())
            .then(() => $translate('CREATION_SUCCESS'))
            .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }))
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error) || 'ERROR_MESSAGE';
                const customHandlerReturnValue = view.onSubmitError() && this.$injector.invoke(
                    view.onSubmitError(),
                    view,
                    { $event, error, errorMessage, entity, entry, route, controller: this, form: this.form, progression, notification }
                );
                if (customHandlerReturnValue === false) return;
                progression.done();
                $translate(errorMessage, {
                    status: error && error.status,
                    details: error && error.data && typeof error.data === 'object' ? JSON.stringify(error.data) : {}
                })
                    .catch(angular.identity) // See https://github.com/angular-translate/angular-translate/issues/1516
                    .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            });
    }

    submitEdition($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        const { view, $state, previousState, progression, notification, $translate } = this;
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        var entry = null;
        progression.start();
        this.WriteQueries
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
                $state.go(previousState.name, previousState.params)
                    .then(() => progression.done())
                    .then(() => $translate('EDITION_SUCCESS'))
                    .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }));
            })
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error) || 'ERROR_MESSAGE';
                const customHandlerReturnValue = view.onSubmitError() && this.$injector.invoke(
                    view.onSubmitError(),
                    view,
                    { $event, error, errorMessage, entity: this.entity, entry, controller: this, form: this.form, progression, notification }
                );
                if (customHandlerReturnValue === false) return;
                progression.done();
                $translate(errorMessage, {
                    status: error && error.status,
                    details: error && error.data && typeof error.data === 'object' ? JSON.stringify(error.data) : {}
                })
                    .catch(angular.identity) // See https://github.com/angular-translate/angular-translate/issues/1516
                    .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
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

FormController.$inject = ['$scope', '$state', '$injector', '$translate', 'previousState', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore'];
