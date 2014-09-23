define(function() {
    'use strict';

    var DeleteController = function($scope, $location, CrudManager, params) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.params = params;

        this.entityLabel = this.params.entity;
        this.entityId = this.params.id;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function() {
        var self = this;

        this.CrudManager.deleteOne(this.params.entity, this.params.id).then(function() {
            self.$location.path('/list/' + self.params.entity);
        });
    };

    DeleteController.prototype.back = function() {
        this.$location.path('/edit/' + this.params.entity + '/' + this.params.id);
    };

    DeleteController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.params = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'CrudManager', 'params'];

    return DeleteController;
});
