define([
    'humane'
], function(humane) {
    'use strict';

    var CreateController = function($scope, $location, $filter, CrudManager, Spinner, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.CrudManager = CrudManager;
        this.Spinner = Spinner;
        this.data = data;
        this.openDatepicker = {};
        this.$scope.order = 'order';

        this.fields = data.fields;
        this.entityLabel = data.entityLabel;

        angular.forEach(data.fields, function(field){
            field.value = null;
        });

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    CreateController.prototype.create = function(form, $event) {
        $event.preventDefault();
        this.Spinner.start();

        var object = {},
            self = this,
            value;

        angular.forEach(this.data.fields, function(field){
            value = field.value;
            if (field.type === 'date') {
                value = self.$filter('date')(value, field.validation.format);
            }

            object[field.name] = value;
        });

        this.CrudManager
            .createOne(this.data.entityName, object)
            .then(function(entity) {
                self.Spinner.stop();
                humane.log('The object has been created.');
                self.$location.path('/edit/' + self.data.entityName + '/' + entity.id);
            });
    };

    CreateController.prototype.back = function() {
        this.$location.path('/list/' + this.data.entityName);
    };

    CreateController.prototype.toggleDatePicker = function($event, fieldName) {
        $event.preventDefault();
        $event.stopPropagation();

        if (typeof(this.openDatepicker[fieldName]) === 'undefined') {
            this.openDatepicker[fieldName] = true;
        } else {
            this.openDatepicker[fieldName] = !this.openDatepicker[fieldName];
        }
    };

    CreateController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.Spinner = undefined;
        this.data = undefined;
    };

    CreateController.$inject = ['$scope', '$location', '$filter', 'CrudManager', 'Spinner', 'data'];

    return CreateController;
});
