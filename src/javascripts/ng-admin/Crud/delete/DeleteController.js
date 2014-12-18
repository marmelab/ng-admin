/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $location, DeleteQueries, notification, params, view, entry) {
        this.$scope = $scope;
        this.$location = $location;
        this.DeleteQueries = DeleteQueries;
        this.entityLabel = params.entity;
        this.entityId = params.id;
        this.view = view;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.entity = view.getEntity();
        this.notification = notification;

        this.$scope.entry = entry;
        this.$scope.view = view;
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var notification = this.notification,
            $location = this.$location,
            entityLabel = this.entityLabel;

        this.DeleteQueries.deleteOne(this.view, this.entityId).then(function () {
            $location.path('/list/' + entityLabel);
        }, function (response) {
            // @TODO: share this method when splitting controllers
            var body = response.data;
            if (typeof body === 'object') {
                body = JSON.stringify(body);
            }

            notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
        });
    };

    DeleteController.prototype.back = function () {
        this.$location.path('/edit/' + this.entityLabel + '/' + this.entityId);
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.DeleteQueries = undefined;
        this.view = undefined;
    };

    DeleteController.$inject = ['$scope', '$location', 'DeleteQueries', 'notification', 'params', 'view', 'entry'];

    return DeleteController;
});
