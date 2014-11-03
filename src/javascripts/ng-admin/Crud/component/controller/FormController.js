/*global define*/

define(function (require) {
    'use strict';

    var FormController = function($scope, $location, $filter, CrudManager, Validator, entity, notification, progress) {
        var isNew = entity.isNew();
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.FormViewRepository = FormViewRepository;
        this.Validator = Validator;
        this.entity = entity;
        this.title = isNew ? entity.getCreateTitle() : entity.getEditTitle();
        this.description = entity.getDescription();
        this.notification = notification;
        this.progress = progress;

        var searchParams = this.$location.search();

        this.fields = entity.getFields();

        if (isNew) {
            for (var fieldName in this.fields) {
                this.fields[fieldName].processDefaultValue();
            }
        }

        this.entityLabel = entity.label();
        this.$scope.entity = this.entity;
        this.$scope.entityConfig = this.entity;
        this.$scope.edit = this.edit.bind(this);
        this.$scope.entry = view;
        this.view = view;
        this.entity = this.view.getEntity();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    FormController.prototype.create = function () {
        this.$location.path('/create/' + this.entity.name());
    };

    FormController.prototype.deleteOne = function () {
        this.$location.path('/delete/' + this.entity.name() + '/' + this.entity.identifier().value());
    };

    FormController.prototype.back = function () {
        this.$location.path('/list/' + this.entity.name());
    };

    FormController.prototype.validate = function (form, $event) {
        $event.preventDefault();
        this.progress.startnotification;

        var value,
            self = this,
            fields = this.view.getFields(),
            mappedObject,
            field,
            i,
            object = {
                id: this.view.identifier().value()
            };

        for (i in fields) {
            field = fields[i];
            value = field.value();
            if (field.type() === 'date') {
                value = self.$filter('date')(value, field.validation().format);
            }

            object[field.name()] = value;
        }

        mappedObject = this.view.mapEntry(object);

        try {
            this.Validator.validate(this.entity.name(), object);
        } catch(e) {
            self.progress.done();
            self.notification.log(e, {addnCls: 'humane-flatty-error'});
            return false;
        }

        return object;
    };

    /**
     * @param {Object} form
     * @param {$event} $event
     */
    FormController.prototype.submitCreation = function (form, $event) {
        var object = this.validate(form, $event),
            self = this;

        if (!object) {
            return;
        }

        this.CrudManager
            .createOne(this.entity.name(), object)
            .then(function(response) {
                self.progress.done();
                self.notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                self.$location.path('/edit/' + self.entity.name() + '/' + response.data.id);
            });
    };

    /**
     * @param {Object} form
     * @param {$event} $event
     */
    FormController.prototype.submitEdition = function (form, $event) {
        var object = this.validate(form, $event);
        if (!object) {
            return;
        }

        this.CrudManager.updateOne(this.entity.name(), object).then(function() {
            self.progress.done();
            self.notification.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
        });
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     * @param {Entity} entity
     */
    FormController.prototype.edit = function (item, entity) {
        this.$location.path('/edit/' + entity.name() + '/' + item[entity.identifier().name()]);
    };

    FormController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$filter = undefined;
        this.$location = undefined;
        this.FormViewRepository = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    FormController.$inject = ['$scope', '$location', '$filter', 'CrudManager', 'Validator', 'entity', 'notification', 'progress'];

    return FormController;
});
