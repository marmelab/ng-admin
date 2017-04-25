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

    deleteOne($event) {
        const entityName = this.entity.name();
        const { $translate, notification, progression } = this;
        progression.start();

        return this.previousStateParametersDeferred.promise
            .then((previousStateParameters) => {
                const fromState = 'delete';
                const fromParams = previousStateParameters;
                let toState;
                let toParams;

                // if previous page was related to deleted entity,
                // redirect to list
                if (fromParams.entity === entityName &&
                    fromParams.id === this.entityId) {
                        toState = this.$state.get('list');
                        toParams = {
                            entity: entityName,
                            ...this.$state.params,
                        };
                }

                return this.WriteQueries.deleteOne(this.view, this.entityId)
                    .then(() => {
                        if(toState){
                            return this.$state.go(toState, toParams);
                        }
                        return this.back();
                    })
                    .then(() => $translate('DELETE_SUCCESS'))
                    .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }))
                    .catch(error => {
                        progression.done();
                        this.HttpErrorService.handleError($event, toState, toParams, fromState, fromParams, error);
                    });
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
    }
}

DeleteController.$inject = ['$scope', '$window', '$state', '$q', '$translate', 'WriteQueries', 'NgAdminConfiguration', 'progression', 'notification', 'params', 'view', 'entry', 'HttpErrorService'];
