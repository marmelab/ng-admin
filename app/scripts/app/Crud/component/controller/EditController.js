define([
    'humane'
], function(humane) {
    'use strict';

    var EditController = function($scope, $location, CrudManager, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.data = data;

        this.$scope.fields = data.fields;
        this.$scope.entityLabel = data.entityLabel;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    EditController.prototype.edit = function(form, $event) {
        $event.preventDefault();

        var object = {
            id: data.entityId
        };

        angular.forEach(data.fields, function(field, name){
            object[name] = field.value;
        });

        if (crudManager.updateOne(data.entityName, object)) {
            humane.log('The object has been updated.');
        }
    };

    EditController.prototype.create = function() {
        this.$location.path('/create/' + data.entityName);
    };

    EditController.prototype.deleteOne = function() {
        this.$location.path('/delete/' + data.entityName + '/' + data.entityId);
    };

    EditController.prototype.back = function() {
        this.$location.path('/list/' + data.entityName);
    };

    EditController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.params = undefined;
    };


    EditController.$inject = ['$scope', '$location', 'CrudManager', 'data'];

    return EditController;
});
