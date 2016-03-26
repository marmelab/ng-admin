export default class FormController {
    constructor($scope, $state, $injector, $translate, WriteQueries, Configuration, progression, notification, view, dataStore) {
        this.$scope = $scope;
        this.$state = $state;
        this.$injector = $injector;
        this.$translate = $translate;
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
            $translate('INVALID_FORM').then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
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
        var entity = this.entity;
        var view = this.view;
        var route = !entity.editionView().enabled ? 'show' : 'edit';
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        var entry = null;
        const { progression, notification, $translate } = this;
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
            .then(customHandlerReturnValue => {
                if (customHandlerReturnValue === false) return;
                progression.done();
                $translate('CREATION_SUCCESS').then(text => notification.log(text, { addnCls: 'humane-flatty-success' }));
                this.$state.go(this.$state.get(route), { entity: entity.name(), id: entry.identifierValue });
            })
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error) | 'ERROR_MESSAGE';
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
                }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            });
    }

    submitEdition($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        var view = this.view;
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        var entry = null;
        const { progression, notification, $translate } = this;
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
                progression.done();
                $translate('EDITION_SUCCESS').then(text => notification.log(text, { addnCls: 'humane-flatty-success' }));
            })
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error) | 'ERROR_MESSAGE';
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
                }).then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            });
    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
        this.$injector = undefined;
        this.$translate = undefined;
        this.WriteQueries = undefined;
        this.dataStore = undefined;
        this.view = undefined;
        this.entity = undefined;
    }
}

FormController.$inject = ['$scope', '$state', '$injector', '$translate', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore'];
