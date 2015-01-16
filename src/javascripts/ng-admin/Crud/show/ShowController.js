/*global define*/

define(function () {
    'use strict';

    var ShowController = function ($scope, $location, $filter, view, entry) {
        this.$scope = $scope;
        this.$location = $location;
        this.$filter = $filter;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();

        this.fields = this.$filter('orderElement')(view.fields());
        this.$scope.entry = entry;
        this.$scope.view = view;
        this.view = view;
        this.entity = this.view.getEntity();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ShowController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    ShowController.$inject = ['$scope', '$location', '$filter', 'view', 'entry'];

    return ShowController;
});
