define(function() {
    'use strict';

    var humane = require('humane'),
        NProgress = require('nprogress');

    var FormController = function($scope, $location, $filter, CrudManager, Validator, data) {
        var isNew = typeof(data.entityId) === 'undefined';
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.CrudManager = CrudManager;
        this.Validator = Validator;
        this.data = data;
        this.openDatepicker = {};
        this.title = isNew ? data.entityConfig.getCreateTitle() : data.entityConfig.getEditTitle();
        this.description = data.entityConfig.getDescription();

        if (isNew) {
            this.clear();
        }

        var searchParams = this.$location.search();
        this.$scope.sortField = 'sortField' in searchParams ? searchParams.sortField : '';
        this.$scope.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.fields = data.fields;
        this.entityLabel = data.entityConfig.label();
        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);
        this.$scope.sort = this.sort.bind(this);
        this.$scope.isSorting = this.isSorting.bind(this);

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    FormController.prototype.create = function() {
        this.$location.path('/create/' + this.data.entityName);
    };

    FormController.prototype.deleteOne = function() {
        this.$location.path('/delete/' + this.data.entityName + '/' + this.data.entityId);
    };

    FormController.prototype.back = function() {
        this.$location.path('/list/' + this.data.entityName);
    };

    FormController.prototype.contains = function(collection, item) {
        if (!collection) {
            return false;
        }

        for(var i = 0, l = collection.length; i < l; i++) {
            if (collection[i] == item) {
                return true;
            }
        }

        return false;
    };

    FormController.prototype.validate = function(form, $event) {
        $event.preventDefault();
        NProgress.start();

        var value,
            self = this,
            object = {
                id: this.data.entityId
            };

        angular.forEach(this.data.fields, function(field){
            value = field.value;
            if (field.type() === 'date') {
                value = self.$filter('date')(value, field.validation().format);
            }

            object[field.getName()] = value;
        });

        try {
            this.Validator.validate(this.data.entityName, object);
        } catch(e) {
            NProgress.done();
            humane.log(e, {addnCls: 'humane-flatty-error'});
            return false;
        }

        return object;
    };

    FormController.prototype.submitCreation = function(form, $event) {
        var object = this.validate(form, $event),
            self = this;

        if (!object){
            return;
        }

        this.CrudManager
            .createOne(this.data.entityName, object)
            .then(function(response) {
                NProgress.done();
                humane.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                self.$location.path('/edit/' + self.data.entityName + '/' + response.data.id);
            });
    };

    FormController.prototype.submitEdition = function(form, $event) {
        var object = this.validate(form, $event),
            self = this;

        if (!object){
            return;
        }

        this.CrudManager.updateOne(this.data.entityName, object).then(function() {
            NProgress.done();
            humane.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
        });
    };

    FormController.prototype.toggleDatePicker = function($event, fieldName) {
        $event.preventDefault();
        $event.stopPropagation();

        if (typeof(this.openDatepicker[fieldName]) === 'undefined') {
            this.openDatepicker[fieldName] = true;
        } else {
            this.openDatepicker[fieldName] = !this.openDatepicker[fieldName];
        }
    };

    /**
     * Return 'even'|'odd' based on the index parameter
     *
     * @param {Number} index
     * @returns {string}
     */
    FormController.prototype.itemClass = function(index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    FormController.prototype.sort = function(entity, field) {
        var dir = 'ASC',
            field = entity.getName() + '.' + field;

        if (this.$scope.sortField === field) {
            dir = this.$scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.changePage(this.$scope.filterQuery, 1, field, dir);
    };

    FormController.prototype.changePage = function(filter, page, sortField, sortDir) {
        this.$location.search('sortField', sortField);
        this.$location.search('sortDir', sortDir);
        this.$location.path('/edit/' + this.data.entityConfig.getName() + '/' + this.data.entityId);
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Entity} entity
     * @param {String} field
     *
     * @returns {Boolean}
     */
    FormController.prototype.isSorting = function(entity, field) {
        return this.$scope.sortField === entity.getName() + '.' + field;
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     * @param {Entity} entity
     */
    FormController.prototype.edit = function(item, entity) {
        this.$location.path('/edit/' +entity.getName() + '/' + item[entity.getIdentifier().getName()]);
    };

    /**
     * Clear all fields data
     */
    FormController.prototype.clear = function() {
        angular.forEach(this.data.fields, function(field){
            field.value = field.name === 'ReferencedList' ? field.setItems([]) : null;
        });
    };

    FormController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.data = undefined;
    };

    FormController.$inject = ['$scope', '$location', '$filter', 'CrudManager', 'Validator', 'data'];

    return FormController;
});
