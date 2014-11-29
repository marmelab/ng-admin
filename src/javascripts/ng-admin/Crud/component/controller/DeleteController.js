/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $location, FormViewRepository, params, view, entry) {
        this.$scope = $scope;
        this.$location = $location;
        this.FormViewRepository = FormViewRepository;
        this.entityLabel = params.entity;
        this.entityId = params.id;
        this.view = view;
        this.titleTemplate = view.getTitle();

        this.$scope.entry = entry;
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var self = this;

        this.FormViewRepository.deleteOne(this.view, this.entityId).then(function () {
            self.$location.path('/list/' + self.entityLabel);
        });
    };

    DeleteController.prototype.back = function () {
        this.$location.path('/edit/' + this.entityLabel + '/' + this.entityId);
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.FormViewRepository = undefined;
        this.view = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'FormViewRepository', 'params', 'view', 'entry'];

    return DeleteController;
});
