/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular');

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     * @constructor
     */
    function DatagridController($scope, $location) {
        this.$scope = $scope;
        this.$location = $location;

        var searchParams = this.$location.search();
        this.sortField = 'sortField' in searchParams ? searchParams.sortField : '';
        this.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.retrieveColumns();
    }

    DatagridController.prototype.retrieveColumns = function () {
        // Column can be set in edit form to display certain column of a ReferencedEntity
        if (this.$scope.columns) {
            return;
        }

        var columns = [];

        // Get identifier field, and build columns array (with only the fields defined with `"list" : true`)
        angular.forEach(this.$scope.entityConfig.getFields(), function (field) {
            if (!field.list()) {
                return;
            }

            columns.push({
                field: field,
                label: field.label()
            });
        });

        this.$scope.columns = columns;
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */
    DatagridController.prototype.isSorting = function (field) {
        return this.sortField === field.getSortName();
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
    DatagridController.prototype.sort = function(field) {
        var dir = 'ASC',
            fieldName = field.getSortName();

        if (this.sortField === fieldName) {
            dir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.$location.search('sortField', fieldName);
        this.$location.search('sortDir', dir);
    };

    DatagridController.$inject = ['$scope', '$location'];

    return DatagridController;
});
