/*global define*/

define(function () {
    'use strict';

    var FormController = function ($scope, $location, $filter, CreateQueries,
                                   UpdateQueries, Validator, Configuration, progression, notification, view, entry) {

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
        this.name = view.getFormName();
        this.actions = view.actions();
        this.fields = view.fields();
        this.config = Configuration();
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entry = entry;
        this.$scope.view = view;
        this.view = view;
        this.entity = this.view.getEntity();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    FormController.prototype.validate = function (form, $event) {
        $event.preventDefault();
        this.progression.start();

        var value,
            entry = this.$scope.entry,
            $filter = this.$filter,
            fields = this.view.getFields(),
            identifierField = this.view.getEntity().identifier(),
            mappedObject,
            field,
            i,
            object = {};

        // Inject identifier
        object[identifierField.name()] = entry.identifierValue;

        for (i in fields) {
            field = fields[i];
            value = entry.values[field.name()];
            if (field.type() === 'date') {
                value = $filter('date')(value, field.format());
            }

            object[field.name()] = value;
        }

        mappedObject = this.view.mapEntry(object);

        try {
            this.Validator.validate(this.view, mappedObject);
        } catch (e) {
            this.progression.done();
            this.notification.log(e, {addnCls: 'humane-flatty-error'});
            return false;
        }

        return object;
    };

    /**
     * @param {Object} form
     * @param {$event} $event
     */
    FormController.prototype.submitCreation = function (form, $event) {
        if (!form.$valid) {
            this.notification.log('invalid form', {addnCls: 'humane-flatty-error'});

            return false;
        }

        var object = this.validate(form, $event),
            progression = this.progression,
            notification = this.notification,
            entity = this.entity,
            $location = this.$location;

        if (!object) {
            return;
        }

        this.CreateQueries
            .createOne(this.view, object)
            .then(function (response) {
                progression.done();
                notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                $location.path('/edit/' + entity.name() + '/' + response.identifierValue);
            }, this.handleError.bind(this));
    };

    FormController.prototype.getValidationClassForField = function(input) {
        if (typeof input === 'undefined') {
            // non-editable fields, or template fields, may not have a corresponding input
            return;
        }
        if (!input.$dirty) {
            // do not fidsplay validation status unless the input has been altered
            return;
        }
        return input.$valid ? 'has-success' : 'has-error';
    }

    /**
     * @param {Object} form
     * @param {$event} $event
     */
    FormController.prototype.submitEdition = function (form, $event) {
        var progression = this.progression,
            notification = this.notification,
            object = this.validate(form, $event);

        if (!object) {
            return;
        }

        this.UpdateQueries
            .updateOne(this.view, object)
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
