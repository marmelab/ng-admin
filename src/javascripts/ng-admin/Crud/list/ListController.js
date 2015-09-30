import Entry from 'admin-config/lib/Entry';

var ListController = function ($scope, $stateParams, $location, $anchorScroll, ReadQueries, progression, view, dataStore, totalItems) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.ReadQueries = ReadQueries;
    this.progression = progression;
    this.view = view;
    this.entity = view.getEntity();
    this.loadingPage = false;
    this.search = $stateParams.search;
    this.dataStore = dataStore;
    this.fields = view.fields();
    this.listActions = view.listActions();
    this.totalItems = totalItems;
    this.page = $stateParams.page || 1;
    this.infinitePagination = this.view.infinitePagination();
    this.nextPageCallback = this.nextPage.bind(this);
    this.setPageCallback = this.setPage.bind(this);
    this.sortField = this.$stateParams.sortField || this.view.getSortFieldName();
    this.sortDir = this.$stateParams.sortDir || this.view.sortDir();

    if ($scope.selectionUpdater) {
        $scope.selection = $scope.selection || [];
        $scope.$watch('selection', $scope.selectionUpdater);
    } else {
        $scope.selection = null;
    }


    $scope.$on('$destroy', this.destroy.bind(this));
};

ListController.prototype.nextPage = function (page) {
    if (this.loadingPage) {
        return;
    }

    let view = this.view,
        dataStore = this.dataStore;

    this.progression.start();

    const references = view.getReferences();
    let data;

    this.ReadQueries
        .getAll(view, page, this.search, this.sortField, this.sortDir)
        .then(response => {
            data = response.data;
            return this.ReadQueries.getReferenceData(view.fields(), data);
        })
        .then((referenceData) => {
            this.progression.done();

            for (var name in referenceData) {
                Entry.createArrayFromRest(
                    referenceData[name],
                    [references[name].targetField()],
                    references[name].targetEntity().name(),
                    references[name].targetEntity().identifier().name()
                ).map(entry => dataStore.addEntry(references[name].targetEntity().uniqueId + '_values', entry))
            }
        })
        .then(() => {
            view.mapEntries(data)
                .map(entry => {
                    dataStore.fillReferencesValuesFromEntry(entry, references, true);
                    dataStore.addEntry(this.entity.uniqueId, entry);
                });

            this.loadingPage = false;
        });
};

ListController.prototype.setPage = function (number) {
    this.$location.search('page', number);
    this.$anchorScroll(0);
};


ListController.prototype.destroy = function () {
    this.$scope = undefined;
    this.$stateParams = undefined;
    this.$location = undefined;
    this.$anchorScroll = undefined;
    this.dataStore = undefined;
};

ListController.$inject = ['$scope', '$stateParams', '$location', '$anchorScroll', 'ReadQueries', 'progression', 'view', 'dataStore', 'totalItems'];

export default ListController;
