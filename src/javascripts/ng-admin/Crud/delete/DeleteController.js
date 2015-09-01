/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $window, $state, WriteQueries, notification, params, view, entry) {
        this.$scope = $scope;
        this.$window = $window;
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
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var notification = this.notification,
            entityName = this.entity.name();

        return this.WriteQueries.deleteOne(this.view, this.entityId)
            .then(
                function () {
                    this.$state.go(this.$state.get('list'), angular.extend({
                        entity: entityName
                    }, this.$state.params));

                    notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });
                }.bind(this),
                function (response) {
                    // @TODO: share this method when splitting controllers
                    var body = response.data;
                    if (typeof body === 'object') {
                        body = JSON.stringify(body);
                    }

                    this.back();

                    notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
                }
            );
    };

    DeleteController.prototype.back = function () {
        this.$window.history.back();
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.WriteQueries = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    DeleteController.$inject = ['$scope', '$window', 'WriteQueries', 'notification', 'params', 'view', 'entry'];

    return DeleteController;
});
