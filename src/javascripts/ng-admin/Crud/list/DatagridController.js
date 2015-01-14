/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     * @param {$anchorScroll} $anchorScroll
     *
     * @constructor
     */
    function DatagridController($scope, $location, $anchorScroll) {
        $scope.entity = $scope.entity();
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.filters = {};

        this.$scope.gotoDetail = this.gotoDetail.bind(this);

        var searchParams = this.$location.search();
        var listView = $scope.entity.listView();
        this.sortField = 'sortField' in searchParams ? searchParams.sortField : listView.sortField();
        this.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : listView.sortDir();
    }

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DatagridController.prototype.gotoDetail = function (entry) {
        this.clearRouteParams();
        var route = this.$scope.entity.isReadOnly ? 'show' : 'edit';

        this.$location.path('/' + route + '/' + entry.entityName + '/' + entry.identifierValue);
        this.$anchorScroll(0);
    };

    DatagridController.prototype.clearRouteParams = function () {
        this.$location.search('q', null);
        this.$location.search('page', null);
        this.$location.search('sortField', null);
        this.$location.search('sortDir', null);
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */
    DatagridController.prototype.isSorting = function (field) {
        return this.sortField === this.getSortName(field);
    };

    /**
     * Return 'even'|'odd' based on the index parameter
     *
     * @param {Number} index
     * @returns {string}
     */
    DatagridController.prototype.itemClass = function (index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    /**
     *
     * @param {Field} field
     */
    DatagridController.prototype.sort = function (field) {
        var dir = 'ASC',
            fieldName = this.getSortName(field);

        if (this.sortField === fieldName) {
            dir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.$location.search('sortField', fieldName);
        this.$location.search('sortDir', dir);
    };

    /**
     * Return fieldName like (view.fieldName) to sort
     *
     * @param {Field} field
     *
     * @returns {String}
     */
    DatagridController.prototype.getSortName = function (field) {
        return this.$scope.name + '.' + field.name();
    };

    DatagridController.$inject = ['$scope', '$location', '$anchorScroll'];

    return DatagridController;
});
