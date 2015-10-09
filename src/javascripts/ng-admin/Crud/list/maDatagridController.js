/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     * @param {$stateParams} $stateParams
     * @param {$anchorScroll} $anchorScroll
     *
     * @constructor
     */
    function DatagridController($scope, $location, $stateParams, $anchorScroll, $attrs) {
        $scope.entity = $scope.entity();
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.datastore = this.$scope.datastore();
        this.filters = {};
        this.shouldDisplayActions = this.$scope.listActions() && this.$scope.listActions().length > 0;
        $scope.toggleSelect = this.toggleSelect.bind(this);
        $scope.toggleSelectAll = this.toggleSelectAll.bind(this);
        $scope.sortField = $attrs.sortField;
        $scope.sortDir = $attrs.sortDir;
        this.sortField = 'sortField' in $stateParams ? $stateParams.sortField : $attrs.sortField;
        this.sortDir = 'sortDir' in $stateParams ? $stateParams.sortDir : $attrs.sortDir;
        $attrs.$observe('sortDir', sortDir => this.sortDir = sortDir);
        $attrs.$observe('sortField', sortField => this.sortField = sortField);
        this.sortCallback = $scope.sort() ? $scope.sort() : this.sort.bind(this);
    }

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
        return this.$scope.name ? this.$scope.name + '.' + field.name() : field.name();
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

    DatagridController.$inject = ['$scope', '$location', '$stateParams', '$anchorScroll', '$attrs'];

    return DatagridController;
});
