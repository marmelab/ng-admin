define([
    'humane'
], function(humane) {
    'use strict';

    var EditController = function($scope, $location, $filter, CrudManager, Spinner, Validator, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.CrudManager = CrudManager;
        this.Validator = Validator;
        this.Spinner = Spinner;
        this.data = data;
        this.openDatepicker = {};

        this.fields = data.fields;
        this.entityLabel = data.entityLabel;
        this.$scope.itemClass = this.itemClass.bind(this);
        this.$scope.edit = this.edit.bind(this);

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    EditController.prototype.submitEdition = function(form, $event) {
        $event.preventDefault();
        this.Spinner.start();

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
            self.Spinner.stop();
            humane.log(e);
            return;
        }

        this.CrudManager.updateOne(this.data.entityName, object).then(function() {
            self.Spinner.stop();
            humane.log('The object has been updated.');
        });
    };

    EditController.prototype.create = function() {
        this.$location.path('/create/' + this.data.entityName);
    };

    EditController.prototype.deleteOne = function() {
        this.$location.path('/delete/' + this.data.entityName + '/' + this.data.entityId);
    };

    EditController.prototype.back = function() {
        this.$location.path('/list/' + this.data.entityName);
    };

    EditController.prototype.toggleDatePicker = function($event, fieldName) {
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
    EditController.prototype.itemClass = function(index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     * @param {Entity} entity
     */
    EditController.prototype.edit = function(item, entity) {
        this.$location.path('/edit/' +entity.getName() + '/' + item[entity.getIdentifier().getName()]);
    };

    EditController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.$filter = undefined;
        this.CrudManager = undefined;
        this.data = undefined;
        this.openDatepicker = undefined;
    };

    EditController.$inject = ['$scope', '$location', '$filter', 'CrudManager', 'Spinner', 'Validator', 'data'];

    return EditController;
});
