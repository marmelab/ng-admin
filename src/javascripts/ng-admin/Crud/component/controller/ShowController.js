/*global define*/

define(function () {
    'use strict';

    var ShowController = function ($scope, $location, FormViewRepository, view, entry) {
        this.$scope = $scope;
        this.$location = $location;
        this.FormViewRepository = FormViewRepository;
        this.title = view.title();
        this.description = view.description();

        this.fields = view.getFields();
        this.$scope.entry = entry;
        this.$scope.view = view;
        this.view = view;
        this.entity = this.view.getEntity();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ShowController.prototype.create = function () {
        this.$location.path('/create/' + this.entity.name());
    };

    ShowController.prototype.deleteOne = function () {
        this.$location.path('/delete/' + this.entity.name() + '/' + this.$scope.entry.identifierValue);
    };

    /**
     * Link to entity list page
     */
    ShowController.prototype.list = function () {
        this.$location.path('/list/' + this.entity.name());
    };

    /**
     * Link to edit entity page
     *
     * @param {View} entry
     */
    ShowController.prototype.edit = function (entry) {
        this.$location.path('/edit/' + entry.entityName  + '/' + entry.identifierValue);
    };

    ShowController.prototype.destroy = function () {
        this.$scope = undefined;
        this.$location = undefined;
        this.FormViewRepository = undefined;
        this.view = undefined;
        this.entity = undefined;
    };

    ShowController.$inject = ['$scope', '$location', 'FormViewRepository', 'view', 'entry'];

    return ShowController;
});
