/*global define*/

define(function () {
    'use strict';

    var DeleteController = function($scope, $location, CrudManager, params, notification) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.params = params;
        this.notification = notification;

        this.entityLabel = this.params.entity;
        this.entityId = this.params.id;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var self = this;

        this.CrudManager.deleteOne(this.params.entity, this.params.id).then(function() {
            self.notification.log('Element successfully deleted.', {addnCls: 'humane-flatty-success'});

            self.$location.path('/list/' + self.params.entity);
        });
    };

    DeleteController.prototype.back = function () {
        this.$location.path('/edit/' + this.params.entity + '/' + this.params.id);
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
        this.params = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'CrudManager', 'params', 'notification'];

    return DeleteController;
});
