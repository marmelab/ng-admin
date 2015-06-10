/*global define*/

define(function () {
    'use strict';

    var BatchDeleteController = function ($scope, $state, WriteQueries, notification, view) {

        this.$scope = $scope;
        this.$state = $state;
        this.WriteQueries = WriteQueries;
        this.notification = notification;
        this.view = view;
        this.entity = view.getEntity();
        this.entityIds = $state.params.ids;
        this.selection = []; // fixme: query db to get selection
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.loadingPage = false;
        this.fields = view.fields();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    BatchDeleteController.prototype.batchDelete = function () {
        var notification = this.notification,
            $state = this.$state,
            entityName = this.entity.name();

        this.WriteQueries.batchDelete(this.view, this.entityIds).then(function () {
            $state.go($state.get('list'), angular.extend({
                entity: entityName
            }, $state.params));
            notification.log('Elements successfully deleted.', { addnCls: 'humane-flatty-success' });
        }, function (response) {
            // @TODO: share this method when splitting controllers
            var body = response.data;
            if (typeof body === 'object') {
                body = JSON.stringify(body);
            }

            notification.log('Oops, an error occured : (code: ' + response.status + ') ' + body, {addnCls: 'humane-flatty-error'});
        });
    };

    BatchDeleteController.prototype.back = function () {

        this.$state.go(this.$state.get('list'), angular.extend({
            entity: this.entity.name()
        }, this.$state.params));
    };

    BatchDeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
        this.WriteQueries = undefined;
    };

    BatchDeleteController.$inject = ['$scope', '$state', 'WriteQueries', 'notification', 'view'];

    return BatchDeleteController;
});
