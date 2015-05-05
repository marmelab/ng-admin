/*global define*/

define(function () {
    'use strict';

    var DeleteController = function ($scope, $state, WriteQueries, notification, params, view, entry) {
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
        $scope.$on('$destroy', this.destroy.bind(this));
    };

    DeleteController.prototype.deleteOne = function () {
        var notification = this.notification,
            $state = this.$state, _this = this;

        this.WriteQueries.deleteOne(this.view, this.entityId).then(function () {
            $state.go($state.get('list'), {
                entity: _this.entity.name(),
                page: _this.$state.params.page,
                search: _this.$state.params.search,
                sortField: _this.$state.params.sortField,
                sortDir: _this.$state.params.sortDir
            });
            notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });
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
        this.$state.go(this.$state.get('edit'), {
            entity: this.entity.name(),
            id: this.entityId,
            page: this.$state.params.page,
            search: this.$state.params.search,
            sortField: this.$state.params.sortField,
            sortDir: this.$state.params.sortDir
        });
    };

    DeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.WriteQueries = undefined;
        this.$state = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    DeleteController.$inject = ['$scope', '$state', 'WriteQueries', 'notification', 'params', 'view', 'entry'];

    return DeleteController;
});
