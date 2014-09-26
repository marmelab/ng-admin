define(function() {
    'use strict';

    var humane = require('humane'),
        NProgress = require('nprogress');

    var FormController = function($scope, $location, $filter, CrudManager, Validator, entity) {
        var isNew = entity.isNew();
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.CrudManager = CrudManager;
        this.Validator = Validator;
        this.entity = entity;
        this.title = isNew ? entity.getCreateTitle() : entity.getEditTitle();
        this.description = entity.getDescription();

        if (isNew) {
            this.clear();
        }

        var searchParams = this.$location.search();
        this.$scope.sortField = 'sortField' in searchParams ? searchParams.sortField : '';
        this.$scope.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.fields = entity.getFields();
        this.entityLabel = entity.label();
        this.$scope.entity = this.entity;
        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);
        this.$scope.sort = this.sort.bind(this);
        this.$scope.isSorting = this.isSorting.bind(this);

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    FormController.prototype.create = function() {
        this.$location.path('/create/' + this.entity.name());
    };

    FormController.prototype.deleteOne = function() {
        this.$location.path('/delete/' + this.entity.name() + '/' + this.entity.getIdentifier().value);
    };

    FormController.prototype.back = function() {
        this.$location.path('/list/' + this.entity.name());
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
                id: this.entity.getIdentifier().value
            };

        angular.forEach(this.entity.getFields(), function(field){
            value = field.value;
            if (field.type() === 'date') {
                value = self.$filter('date')(value, field.validation().format);
            }

            object[field.name()] = value;
        });

        try {
            this.Validator.validate(this.entity.name(), object);
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
            .createOne(this.entity.name(), object)
            .then(function(response) {
                NProgress.done();
                humane.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
                self.$location.path('/edit/' + self.entity.name() + '/' + response.data.id);
            });
    };

    FormController.prototype.submitEdition = function(form, $event) {
        var object = this.validate(form, $event),
            self = this;

        if (!object){
            return;
        }

        this.CrudManager.updateOne(this.entity.name(), object).then(function() {
            NProgress.done();
            humane.log('Changes successfully saved.', {addnCls: 'humane-flatty-success'});
        });
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

    /**
     *
     * @param {Field} field
     */
    FormController.prototype.sort = function(field) {
        var dir = 'ASC',
            fieldName = field.getSortName();

        if (this.$scope.sortField === fieldName) {
            dir = this.$scope.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.changePage(this.$scope.filterQuery, 1, fieldName, dir);
    };

    FormController.prototype.changePage = function(filter, page, sortField, sortDir) {
        this.$location.search('sortField', sortField);
        this.$location.search('sortDir', sortDir);
        this.$location.path('/edit/' + this.entity.name() + '/' + this.entity.getIdentifier().value);
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */
    FormController.prototype.isSorting = function(field) {
        return this.$scope.sortField === field.getSortName();
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     * @param {Entity} entity
     */
    FormController.prototype.edit = function(item, entity) {
        this.$location.path('/edit/' +entity.name() + '/' + item[entity.getIdentifier().name()]);
    };

    /**
     * Clear all fields
     */
    FormController.prototype.clear = function() {
        angular.forEach(this.entity.getFields(), function(field){
            field.clear();
        });
    };

    FormController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.entity = undefined;
    };

    FormController.$inject = ['$scope', '$location', '$filter', 'CrudManager', 'Validator', 'entity'];

    return FormController;
});
