export default class FormController {
    constructor($scope, $state, WriteQueries, Configuration, progression, notification, view, dataStore) {
        this.$scope = $scope;
        this.$state = $state;
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
            this.notification.log('invalid form', { addnCls: 'humane-flatty-error' });
            return false;
        }

        try {
            this.view.validate(this.$scope.entry);
        } catch (e) {
            this.notification.log(e, { addnCls: 'humane-flatty-error' });
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
        this.progression.start();
        this.WriteQueries
            .createOne(view, restEntry)
            .then(rawEntry => {
                this.progression.done();
                this.notification.log('Element successfully created.', { addnCls: 'humane-flatty-success' });
                var entry = view.mapEntry(rawEntry);
                this.$state.go(this.$state.get(route), { entity: entity.name(), id: entry.identifierValue });
            }, this.handleError.bind(this));
    }

    submitEdition($event) {
        $event.preventDefault();
        if (!this.validateEntry()) {
            return;
        }
        var view = this.view;
        var restEntry = this.$scope.entry.transformToRest(view.fields());
        this.progression.start();
        this.WriteQueries
            .updateOne(view, restEntry, this.originEntityId)
            .then(() => {
                this.progression.done();
                this.notification.log('Changes successfully saved.', { addnCls: 'humane-flatty-success' });
            }, this.handleError.bind(this));
    }

    /**
     * Handle create or update errors
     *
     * @param {Object} response
     */
    handleError(response) {
        var errorMessage = this.config.getErrorMessageFor(this.view, response);

        this.progression.done();
        this.notification.log(errorMessage, {addnCls: 'humane-flatty-error'});
    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
        this.WriteQueries = undefined;
        this.dataStore = undefined;
        this.view = undefined;
        this.entity = undefined;
    }
}

FormController.$inject = ['$scope', '$state', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore'];
