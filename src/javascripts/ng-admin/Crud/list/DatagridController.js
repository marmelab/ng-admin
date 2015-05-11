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

        $scope.toggleSelect = this.toggleSelect.bind(this);
        $scope.toggleSelectAll = this.toggleSelectAll.bind(this);

        this.$scope.gotoDetail = this.gotoDetail.bind(this);

        var searchParams = this.$location.search();
        this.sortField = 'sortField' in searchParams ? searchParams.sortField : this.$scope.sortField();
        this.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : this.$scope.sortDir();
        console.log(this.sortField, this.sortDir);
    }

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DatagridController.prototype.gotoDetail = function (entry) {
        this.clearRouteParams();
        var entity = this.$scope.entity;
        var route = entity.editionView().enabled ? 'edit' : 'show';
        this.$location.path('/' + entry.entityName + '/' + route + '/' + entry.identifierValue);
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

    DatagridController.prototype.toggleSelect = function (entry) {
        var selection = this.$scope.selection.slice();

        var index = selection.indexOf(entry);

        if (index === -1) {
            this.$scope.selection = selection.concat(entry);
            return;
        }
        selection.splice(index, 1);
        this.$scope.selection = selection;
    };

    DatagridController.prototype.toggleSelectAll = function () {

        if (this.$scope.selection.length < this.$scope.entries.length) {
            this.$scope.selection = this.$scope.entries;
            return;
        }

        this.$scope.selection = [];
    };

    DatagridController.$inject = ['$scope', '$location', '$anchorScroll'];

    return DatagridController;
});
