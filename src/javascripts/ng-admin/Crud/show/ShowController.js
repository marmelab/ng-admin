/*global define*/

define(function () {
    'use strict';

    var ShowController = function ($scope, $location, view, dataStore) {
        this.$scope = $scope;
        this.$location = $location;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();

        this.fields = view.fields();
        this.$scope.entry = dataStore.getFirstEntry(view.getEntity().uniqueId);
        this.$scope.view = view;
        this.view = view;
        this.entity = this.view.getEntity();
        this.dataStore = dataStore;

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ShowController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.view = undefined;
        this.entity = undefined;
        this.dataStore = undefined;
    };

    ShowController.$inject = ['$scope', '$location', 'view', 'dataStore'];

    return ShowController;
});
