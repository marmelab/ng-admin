export default class BatchDeleteController {
    constructor($scope, $state, $translate, WriteQueries, progression, notification, view, HttpErrorService) {
        this.$scope = $scope;
        this.$state = $state;
        this.$translate = $translate;
        this.WriteQueries = WriteQueries;
        this.progression = progression;
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
        this.HttpErrorService = HttpErrorService;

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    batchDelete($event) {
        const entityName = this.entity.name();
        const { $translate, $state, progression, notification } = this;
        const fromState = $state.current.name;
        const fromParams = $state.current.params;
        const toState = $state.get('list');
        const toParams = {
            entity: entityName,
            ...$state.params,
        };
        progression.start();
        return this.WriteQueries.batchDelete(this.view, this.entityIds)
            .then(() => $state.go(toState, toParams))
            // no need to call progression.done() in case of success, as it's called by the view dislayed afterwards
            .then(() => $translate('BATCH_DELETE_SUCCESS'))
            .then(text => notification.log(text, { addnCls: 'humane-flatty-success' }))
            .catch(error => {
                progression.done();
                this.HttpErrorService.handleError($event, toState, toParams, fromState, fromParams, error);
            });
    }

    back() {
        this.$state.go(this.$state.get('list'), angular.extend({
            entity: this.entity.name()
        }, this.$state.params));
    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
        this.$translate = undefined;
        this.WriteQueries = undefined;
        this.progression = undefined;
        this.notification = undefined;
    }
}

BatchDeleteController.$inject = ['$scope', '$state', '$translate', 'WriteQueries', 'progression', 'notification', 'view', 'HttpErrorService'];
