/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $location, DeleteRepository, params, view, entry) {
        this.$scope = $scope;
        this.$location = $location;
        this.DeleteRepository = DeleteRepository;
        this.entityLabel = params.entity;
        this.entityId = params.id;
        this.view = view;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();

        this.$scope.entry = entry;
        this.$scope.view = view;
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var self = this;

        this.DeleteRepository.deleteOne(this.view, this.entityId).then(function () {
            self.$location.path('/list/' + self.entityLabel);
        });
    };

    DeleteController.prototype.back = function () {
        this.$location.path('/edit/' + this.entityLabel + '/' + this.entityId);
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.DeleteRepository = undefined;
        this.view = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'DeleteRepository', 'params', 'view', 'entry'];

    return DeleteController;
});
