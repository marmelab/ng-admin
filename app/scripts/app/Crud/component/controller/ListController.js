define([], function() {
    'use strict';

    var ListController = function($scope, $location, $anchorScroll/*, data*/) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
//        this.data = data;

        this.$scope.fields = data.fields;
        this.$scope.entityLabel = data.entityLabel;

        this.computePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.computePagination = function () {
        var entityConfig = data.entityConfig,
            rawItems = data.rawItems,
            columns = [],
            identifierField = 'id';

        // Get identifier field, and build columns array (with only the fields defined with `"list" : true`)
        angular.forEach(entityConfig.fields, function(field, fieldName) {
            if(typeof(field.identifier) !== 'undefined') {
                identifierField = fieldName;
            }
            if(typeof(field.list) === 'undefined' || field.list !== true) {
                return;
            }

            columns.push({
                field: fieldName,
                label: field.label
            });
        });


        this.$scope.entityLabel = entityConfig.label;
        this.$scope.grid = {
            dimensions : [ columns.length, rawItems.length ],
            columns: columns,
            items: rawItems
        };

        this.$scope.currentPage = data.currentPage;
        this.$scope.nbPages = (data.totalItems / (data.perPage | 1)) + 1;
    };

    /**
     * Link to page number of the list
     *
     * @param {int} number
     */
    ListController.prototype.setPage = function (number) {
        if(number <= 0 || number > $scope.nbPages) {
            return;
        }

        $location.path('/list/' + data.entityName + '/page/' + number);
        $anchorScroll(0);
    };

    /**
     * Return an array with the range between min & max
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */
    ListController.prototype.range = function(min, max){
        var input = [];

        for (var i = min; i <= max; i ++) {
            input.push(i);
        }

        return input;
    };

    /**
     * Return 'even'|'odd' based on the index parameter
     *
     * @param {Number} index
     * @returns {string}
     */
    ListController.prototype.itemClass = function(index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    /**
     * Link to entity creation page
     */
    ListController.prototype.create = function() {
        $location.path('/create/' + data.entityName);
        $anchorScroll(0);
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     */
    ListController.prototype.edit = function(item) {
        $location.path('/edit/' + data.entityName + '/' + item[identifierField]);
        $anchorScroll(0);
    };

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data'];

    return ListController;
});

