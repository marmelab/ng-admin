define([
    'humane'
], function(humane) {
    'use strict';

    var EditController = function($scope, $location, CrudManager, Spinner, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.Spinner = Spinner;
        this.data = data;

        this.$scope.fields = data.fields;
        this.$scope.entityLabel = data.entityLabel;
        this.$scope.order = 'order';

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    EditController.prototype.edit = function(form, $event) {
        $event.preventDefault();
        this.Spinner.start();

        var self = this,
            object = { id: this.data.entityId };

        angular.forEach(this.data.fields, function(field){
            object[field.name] = field.value;
        });

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

    EditController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.data = undefined;
    };

    EditController.$inject = ['$scope', '$location', 'CrudManager', 'Spinner', 'data'];

    return EditController;
});
