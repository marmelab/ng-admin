define([
    'humane'
], function(humane) {
    'use strict';

    var CreateController = function($scope, $location, CrudManager, Spinner, data, references) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.Spinner = Spinner;
        this.data = data;

        console.log(references);

        $scope.fields = data.fields;
        $scope.entityLabel = data.entityLabel;

        angular.forEach(data.fields, function(field){
            field.value = null;
        });

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    CreateController.prototype.create = function(form, $event) {
        $event.preventDefault();
        this.Spinner.start();

        var object = {},
            self = this;

        angular.forEach(this.data.fields, function(field){
            object[field.getName()] = field.value;
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

    CreateController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.Spinner = undefined;
        this.data = undefined;
    };

    CreateController.$inject = ['$scope', '$location', 'CrudManager', 'Spinner', 'data', 'references'];

    return CreateController;
});
