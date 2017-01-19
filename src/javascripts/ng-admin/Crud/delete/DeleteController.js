export default class DeleteController {
    constructor($scope, $window, $state, $q, $translate, WriteQueries, Configuration, progression, notification, params, view, entry, HttpErrorService) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.$translate = $translate;
        this.WriteQueries = WriteQueries;
        this.config = Configuration();
        this.entityLabel = params.entity;
        this.entityId = params.id;
        this.view = view;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.entity = view.getEntity();
        this.progression = progression;
        this.notification = notification;
        this.$scope.entry = entry;
        this.$scope.view = view;
        this.HttpErrorService = HttpErrorService;

        $scope.$on('$destroy', this.destroy.bind(this));

        this.previousStateParametersDeferred = $q.defer();
        $scope.$on('$stateChangeSuccess', (event, to, toParams, from, fromParams) => {
            this.previousStateParametersDeferred.resolve(fromParams);
        });
    }

    deleteOne() {
        const entityName = this.entity.name();
        const { $translate, notification, progression } = this;
        progression.start();
        return this.WriteQueries.deleteOne(this.view, this.entityId)
            .then(() => this.previousStateParametersDeferred.promise)
            .then(previousStateParameters => {
                // if previous page was related to deleted entity, redirect to list
                if (previousStateParameters.entity === entityName && previousStateParameters.id === this.entityId) {
                    return this.$state.go(this.$state.get('list'), angular.extend({
                        entity: entityName
                    }, this.$state.params));
                }
                return this.back();
            })
            // no need to call progression.done() in case of success, as it's called by the view dislayed afterwards
            .then(() => $translate('DELETE_SUCCESS'))
            .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }))
            .catch(error => {
                const errorMessage = this.HttpErrorService.handleError(this.config.getErrorMessageFor(this.view, error) || 'ERROR_MESSAGE');
                progression.done();
                //$translate(errorMessage, {
                //    status: error && error.status,
                //    details: error && error.data && typeof error.data === 'object' ? JSON.stringify(error.data) : {}
                //})
                //    .catch(angular.identity) // See https://github.com/angular-translate/angular-translate/issues/1516
                //   .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
            });
    }

    back() {
        this.$window.history.back();
    }

    destroy() {
        this.$scope = undefined;
        this.$window = undefined;
        this.$state = undefined;
        this.$translate = undefined;
        this.WriteQueries = undefined;
        this.view = undefined;
        this.entity = undefined;
        this.progression = undefined;
        this.notification = undefined;
        this.HttpErrorService = undefined;
    }
}

DeleteController.$inject = ['$scope', '$window', '$state', '$q', '$translate', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'params', 'view', 'entry', 'HttpErrorService'];
