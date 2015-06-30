/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $window, $state, WriteQueries, notification, params, view, entry) {
        this.$scope = $scope;
        this.$state = $state;
        this.WriteQueries = WriteQueries;
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
        this.goBack = function(){ $window.history.back(); }
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var notification = this.notification,
            $state = this.$state, entityName = this.entity.name();

        this.WriteQueries.deleteOne(this.view, this.entityId).then(function () {

            this.goBack();
            notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });
        }.bind(this), function (response) {
            // @TODO: share this method when splitting controllers
            var body = response.data;
            if (typeof body === 'object') {
                body = JSON.stringify(body);
            }

            notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
        });
    };

    DeleteController.prototype.back = function () {
        this.goBack();
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.WriteQueries = undefined;
        this.$state = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    DeleteController.$inject = ['$scope', '$window', '$state', 'WriteQueries', 'notification', 'params', 'view', 'entry'];

    return DeleteController;
});
