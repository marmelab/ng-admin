define([], function() {
    'use strict';

    var ListController = function($scope, $location, $anchorScroll, data, CrudManager, $famous) {
        this.$scope = $scope;
        this.$location = $location;
        this.CrudManager = CrudManager;
        this.data = data;
        this.$anchorScroll = $anchorScroll;
        this.loadingPage = false;

        this.$scope.fields = data.fields;
        this.$scope.entityLabel = data.entityLabel;
        this.identifierField = 'id';

        this.computePagination();

        $scope.$on('$destroy', this.destroy.bind(this));
    };

    ListController.prototype.computePagination = function () {
        var entityConfig = this.data.entityConfig,
            rawItems = this.data.rawItems,
            columns = [],
            self = this;

        // Get identifier field, and build columns array (with only the fields defined with `"list" : true`)
        angular.forEach(entityConfig.getFields(), function(field) {
            if(!field.list()) {
                return;
            }

            if(field.identifier()) {
                self.identifierField = field.getName();
            }

            columns.push({
                field: field.getName(),
                label: field.label()
            });
        });


        this.$scope.entityLabel = entityConfig.label();
        this.$scope.grid = {
            dimensions : [ columns.length, rawItems.length ],
            columns: columns,
            items: rawItems
        };

        this.$scope.infinitePagination = entityConfig.infinitePagination();
        this.$scope.currentPage = this.data.currentPage;
        this.$scope.nbPages = Math.ceil(this.data.totalItems / (this.data.perPage || 1));
    };

    ListController.prototype.nextPage = function() {
        if (this.loadingPage || entityConfig.infinitePagination()) {
            return;
        }

        var self = this;
        this.loadingPage = true;
        this.$scope.currentPage++;

        this.CrudManager.getAll($stateParams.entity, this.$scope.currentPage).then(function(nextData) {
            self.$scope.grid.push(nextData.rawItems);
            self.loadingPage = false;
        });
    };

    /**
     * Link to page number of the list
     *
     * @param {int} number
     */
    ListController.prototype.setPage = function (number) {
        if(number <= 0 || number > this.$scope.nbPages) {
            return;
        }

        this.$location.path('/list/' + this.data.entityName + '/page/' + number);
        this.$anchorScroll(0);
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
        this.$location.path('/create/' + this.data.entityName);
        this.$anchorScroll(0);
    };

    /**
     * Link to edit entity page
     *
     * @param {Object} item
     */
    ListController.prototype.edit = function(item) {
        this.$location.path('/edit/' + this.data.entityName + '/' + item[this.identifierField]);
        this.$anchorScroll(0);
    };

    ListController.prototype.destroy = function() {
        this.$scope = undefined;
        this.$location = undefined;
        this.CrudManager = undefined;
    };

    ListController.$inject = ['$scope', '$location', '$anchorScroll', 'data', 'CrudManager', '$famous'];

    return ListController;
});

