/*global define*/

define(function () {
    'use strict';

    var BatchDeleteController = function ($scope, $stateParams, $filter, $location, DeleteQueries, notification, view) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.$location = $location;
        this.DeleteQueries = DeleteQueries;
        this.notification = notification;
        this.view = view;
        this.entity = view.getEntity();
        this.selection = $stateParams.selection;
        this.entityIds = this.selection.map(function (entry) {
            return entry.identifierValue;
        });
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.loadingPage = false;
        this.fields = this.$filter('orderElement')(view.fields());

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    BatchDeleteController.prototype.batchDelete = function () {
        var notification = this.notification,
            $location = this.$location,
            entityName = this.entity.name();

        this.DeleteQueries.batchDelete(this.view, this.entityIds).then(function () {
            $location.path('/list/' + entityName);
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
        this.$location.path('/list/' + this.entity.name());
    };

    BatchDeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$stateParams = undefined;
        this.$filter = undefined;
        this.$location = undefined;
        this.DeleteQueries = undefined;
    };

    BatchDeleteController.$inject = ['$scope', '$stateParams', '$filter', '$location', 'DeleteQueries', 'notification', 'view'];

    return BatchDeleteController;
});
