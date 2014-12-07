/*global define*/

define(function () {
    'use strict';

    var FormController = function ($scope, $location, $filter, CreateQueries,
                                   UpdateQueries, Validator, progression, notification, view, entry) {

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

        this.fields = view.getFields();
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
            self = this,
            fields = this.view.getFields(),
            mappedObject,
            field,
            i,
            object = {
                id: entry.identifierValue
            };

        for (i in fields) {
            field = fields[i];
            value = entry.values[field.name()];
            if (field.type() === 'date') {
                value = self.$filter('date')(value, field.validation().format);
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
            self = this;

        if (!object) {
            return;
        }

        this.CreateQueries
            .createOne(this.view, object)
            .then(function (response) {
                self.progression.done();
                self.notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                self.$location.path('/edit/' + self.entity.name() + '/' + response.identifierValue);
            });
    };

    /**
     * @param {Object} form
     * @param {$event} $event
     */
    FormController.prototype.submitEdition = function (form, $event) {
        var self = this,
            object = this.validate(form, $event);

        if (!object) {
            return;
        }

        this.UpdateQueries
            .updateOne(this.view, object)
            .then(function () {
                self.progression.done();
                self.notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
            });
    };

    /**
     * Link to edit entity page
     *
     * @param {View} entry
     */
    FormController.prototype.edit = function (entry) {
        this.$location.path('/edit/' + entry.entityName  + '/' + entry.identifierValue);
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

    FormController.$inject = ['$scope', '$location', '$filter', 'CreateQueries', 'UpdateQueries', 'Validator', 'progression', 'notification', 'view', 'entry'];

    return FormController;
});
