/*global define*/

define(function () {
    'use strict';

    var BatchDeleteController = function ($scope, $stateParams, $filter, $anchorScroll, progression, view) {
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.progression = progression;
        this.view = view;
        this.entity = view.getEntity();
        this.selection = $stateParams.selection;
        this.title = view.title();
        this.description = view.description();
        this.actions = view.actions();
        this.loadingPage = false;
        this.fields = this.$filter('orderElement')(view.fields());

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    BatchDeleteController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$stateParams = undefined;
        this.$filter = undefined;
        this.$anchorScroll = undefined;
    };

    BatchDeleteController.$inject = ['$scope', '$stateParams', '$filter', '$anchorScroll', 'progression', 'view'];

    return BatchDeleteController;
});
