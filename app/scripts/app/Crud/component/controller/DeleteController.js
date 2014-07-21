define([], function() {
    'use strict';

    var DeleteController = function($scope, $location, CrudManager, params) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.params = params;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function() {
        var self = this;

        this.CrudManager.deleteOne(params.entity, params.id).then(function() {
            self.$location.path('/list/' + params.entity);
        });
    };

    DeleteController.prototype.back = function() {
        this.$location.path('/edit/' + params.entity + '/' + params.id);
    };

    DeleteController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.params = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'CrudManager', 'data'];

    return DeleteController;
});
