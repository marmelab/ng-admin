define([
    'humane'
], function(humane) {
    'use strict';

    var CreateController = function($scope, $location, CrudManager, data) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.data = data;

        $scope.fields = data.fields;
        $scope.entityLabel = data.entityLabel;

        angular.forEach(data.fields, function(field, name){
            field.value = null;
        });

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    CreateController.prototype.create = function(form, $event) {
        $event.preventDefault();

        var object = {},
            self = this;

        angular.forEach(this.data.fields, function(field, name){
            object[name] = field.value;
        });

        this.CrudManager
            .createOne(this.data.entityName, object)
            .then(function(entity) {
                humane.log('The object has been created.');
                self.$location.path('/edit/' + self.data.entityName + '/' + entity.id);
            });
    };

    CreateController.prototype.back = function() {
        this.$location.path('/list/' + this.data.entityName);
    };

    CreateController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.data = undefined;
    };

    CreateController.$inject = ['$scope', '$location', 'CrudManager', 'data'];

    return CreateController;
});
