/*global define*/

define(function () {
    'use strict';

    var FormController = function ($scope, $location, $filter, CreateQueries, UpdateQueries, Validator, Configuration,
                                   progression, notification, view, entry) {

        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.CreateQueries = CreateQueries;
        this.UpdateQueries = UpdateQueries;
        this.Validator = Validator;
        this.progression = progression;
        this.notification = notification;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.fields = this.$filter('orderElement')(view.fields());
        this.config = Configuration();
        this.view = view;
        this.entity = this.view.getEntity();
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entry = entry;
        this.$scope.view = view;
        this.$scope.entity = this.entity;

        // in case of entity identifier being modified
        this.originEntityId = entry.values[this.entity.identifier().name()]

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

        mappedObject = this.view.mapEntry(object);

        try {
            this.Validator.validate(this.view, mappedObject);
        } catch (e) {
            this.notification.log(e, {addnCls: 'humane-flatty-error'});
            return false;
        }

        return object;
    };

    FormController.prototype.submitCreation = function ($event) {
        $event.preventDefault();
        var entry = this.validateEntry();
        if (!entry) {
            return;
        }
        var progression = this.progression,
            notification = this.notification,
            entity = this.entity,
            $location = this.$location;
        progression.start();
        this.CreateQueries
            .createOne(this.view, entry)
            .then(function (response) {
                progression.done();
                notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                $location.path('/edit/' + entity.name() + '/' + response.identifierValue);
            }, this.handleError.bind(this));
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
        this.UpdateQueries
            .updateOne(this.view, entry, this.originEntityId)
            .then(function () {
                progression.done();
                notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
            }, this.handleError.bind(this));
    };

    /**
     * Link to edit entity page
     *
     * @param {View} entry
     */
    FormController.prototype.edit = function (entry) {
        this.$location.path('/edit/' + entry.entityName  + '/' + entry.identifierValue);
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
        this.$filter = undefined;
        this.$location = undefined;
        this.CreateQueries = undefined;
        this.UpdateQueries = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    FormController.$inject = ['$scope', '$location', '$filter', 'CreateQueries', 'UpdateQueries', 'Validator', 'NgAdminConfiguration', 'progression', 'notification', 'view', 'entry'];

    return FormController;
});
