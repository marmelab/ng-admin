/*global define*/

define(function () {
    'use strict';

    var BatchDeleteController = function ($scope, $state, $stateParams, $location, $window, WriteQueries, notification, view) {

        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$window = $window;
        this.WriteQueries = WriteQueries;
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
            _this = this;

        this.WriteQueries.batchDelete(this.view, this.entityIds).then(function () {
            $state.go($state.get('list'), {
                entity: _this.entity.name(),
                page: _this.$stateParams.page,
                search: _this.$stateParams.search,
                sortField: _this.$stateParams.sortField,
                sortDir: _this.$stateParams.sortDir
            });
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
        this.$state.go(this.$state.get('list'), {
            entity: this.entity.name(),
            page: this.$stateParams.page,
            search: this.$stateParams.search,
            sortField: this.$stateParams.sortField,
            sortDir: this.$stateParams.sortDir
        });
    };

    BatchDeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$state = undefined;
        this.$stateParams = undefined;
        this.$location = undefined;
        this.$window = undefined;
        this.WriteQueries = undefined;
    };

    BatchDeleteController.$inject = ['$scope', '$state', '$stateParams', '$location', '$window', 'WriteQueries', 'notification', 'view'];


    return BatchDeleteController;
});
