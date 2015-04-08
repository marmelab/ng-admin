/*global define*/

define(function () {
    'use strict';

    var BatchDeleteController = function ($scope, $state, $stateParams, $location, $window, DeleteQueries, notification, view) {
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$window = $window;
        this.DeleteQueries = DeleteQueries;
        this.notification = notification;
        this.view = view;
        this.entity = view.getEntity();
        this.entityIds = $stateParams.ids;
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

        this.DeleteQueries.batchDelete(this.view, this.entityIds).then(function () {
            $state.go($state.get('list'), { 'entity': entityName });
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
        this.$window.history.back();
    };

    BatchDeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
        this.$stateParams = undefined;
        this.$location = undefined;
        this.$window = undefined;
        this.DeleteQueries = undefined;
    };

    BatchDeleteController.$inject = ['$scope', '$state', '$stateParams', '$location', '$window', 'DeleteQueries', 'notification', 'view'];

    return BatchDeleteController;
});
