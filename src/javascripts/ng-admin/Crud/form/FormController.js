/*global define*/

define(function () {
    'use strict';

    var FormController = function ($scope, $state, WriteQueries, Configuration,
                                   progression, notification, view, dataStore) {

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
    };

    FormController.prototype.validateEntry = function () {
        var value,
            form = this.form,
            entry = this.$scope.entry,
            fields = this.view.getFields(),
            identifierField = this.entity.identifier(),
            mappedObject,
            field,
            i,
            object = {};

        if (!form.$valid) {
            this.notification.log('invalid form', {addnCls: 'humane-flatty-error'});
            return false;
        }

        // Inject identifier
        object[identifierField.name()] = entry.identifierValue;

        for (i in fields) {
            field = fields[i];
            value = entry.values[field.name()];
            object[field.name()] = value;
        }

        mappedObject = this.dataStore.mapEntry(
            this.view.entity.name(),
            this.view.identifier(),
            this.view.getFields(),
            object
        );

        try {
            this.view.validate(mappedObject);
        } catch (e) {
            this.notification.log(e, {addnCls: 'humane-flatty-error'});
            return false;
        }

        return object;
    };

    FormController.prototype.submitCreation = function ($event) {
        $event.preventDefault();
        var entry = this.validateEntry();
        var entity = this.entity;
        var route = !entity.editionView().enabled ? 'show' : 'edit';
        if (!entry) {
            return;
        }
        var progression = this.progression,
            notification = this.notification,
            $state = this.$state;
        progression.start();
        this.WriteQueries
            .createOne(this.view, entry)
            .then(function (rawEntry) {
                var entry = this.dataStore.mapEntry(entity.name(), this.view.identifier(), this.view.getFields(), rawEntry);
                progression.done();
                notification.log('Element successfully created.', {addnCls: 'humane-flatty-success'});
                $state.go($state.get(route), { entity: entity.name(), id: entry.identifierValue });
            }.bind(this), this.handleError.bind(this));
    };

    FormController.prototype.submitEdition = function ($event) {
        $event.preventDefault();
        var entry = this.validateEntry();
        if (!entry) {
            return;
        }
        var progression = this.progression,
            notification = this.notification;
        progression.start();
        this.WriteQueries
            .updateOne(this.view, entry, this.originEntityId)
            .then(function () {
                progression.done();
                notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
            }, this.handleError.bind(this));
    };

    /**
     * Handle create or update errors
     *
     * @param {Object} response
     */
    FormController.prototype.handleError = function (response) {
        var errorMessage = this.config.getErrorMessageFor(this.view, response);

        this.progression.done();
        this.notification.log(errorMessage, {addnCls: 'humane-flatty-error'});
    };

    FormController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
        this.WriteQueries = undefined;
        this.dataStore = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    FormController.$inject = ['$scope', '$state', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'dataStore'];

    return FormController;
});
