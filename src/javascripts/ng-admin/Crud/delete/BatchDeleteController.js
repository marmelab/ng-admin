export default class BatchDeleteController {
    constructor($scope, $state, $translate, WriteQueries, notification, view) {
        this.$scope = $scope;
        this.$state = $state;
        this.$translate = $translate;
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
    }

    batchDelete() {
        const entityName = this.entity.name();
        const { $translate, $state, notification } = this;

        this.WriteQueries.batchDelete(this.view, this.entityIds)
            .then(() => {
                $state.go($state.get('list'), angular.extend({
                    entity: entityName
                }, $state.params));
                $translate('BATCH_DELETE_SUCCESS').then(text => notification.log(text, { addnCls: 'humane-flatty-success' }));
            })
            .catch(error => {
                const errorMessage = this.config.getErrorMessageFor(this.view, error) || 'ERROR_MESSAGE';
                $translate(errorMessage, {
                    status: error && error.status,
                    details: error && error.data && typeof error.data === 'object' ? JSON.stringify(error.data) : {}
                })
                    .catch(angular.identity) // See https://github.com/angular-translate/angular-translate/issues/1516
                    .then(text => notification.log(text, { addnCls: 'humane-flatty-error' }));
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
    }
}

BatchDeleteController.$inject = ['$scope', '$state', '$translate', 'WriteQueries', 'notification', 'view'];
