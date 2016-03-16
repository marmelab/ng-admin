export default class DeleteController {
    constructor($scope, $window, $state, $q, WriteQueries, Configuration, notification, params, view, entry) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.WriteQueries = WriteQueries;
        this.config = Configuration();
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

        this.previousStateParametersDeferred = $q.defer();
        $scope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {
            this.previousStateParametersDeferred.resolve(fromParams);
        });
    }

    deleteOne() {
        var notification = this.notification,
            entityName = this.entity.name();

        return this.WriteQueries.deleteOne(this.view, this.entityId)
            .then(
                () => {
                    this.previousStateParametersDeferred.promise.then(previousStateParameters => {
                        // if previous page was related to deleted entity, redirect to list
                        if (previousStateParameters.entity === entityName && previousStateParameters.id === this.entityId) {
                            this.$state.go(this.$state.get('list'), angular.extend({
                                entity: entityName
                            }, this.$state.params));
                        } else {
                            this.back();
                        }

                        notification.log('Element successfully deleted.', { addnCls: 'humane-flatty-success' });
                    });
                }
            )
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error);
                notification.log(errorMessage, {addnCls: 'humane-flatty-error'});
            });
    }

    back() {
        this.$window.history.back();
    }

    destroy() {
        this.$scope = undefined;
        this.WriteQueries = undefined;
        this.view = undefined;
        this.entity = undefined;
    }
}

DeleteController.$inject = ['$scope', '$window', '$state', '$q', 'WriteQueries', 'NgAdminConfiguration', 'notification', 'params', 'view', 'entry'];
