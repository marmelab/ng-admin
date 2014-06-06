define([
    'app'
], function(app) {
    'use strict';

    app.controller('ListCtrl', function ($scope, $location, $anchorScroll, data) {

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


        $scope.entityLabel = entityConfig.label;
        $scope.grid = {
            dimensions : [ columns.length, rawItems.length ],
            columns: columns,
            items: rawItems
        };
        $scope.currentPage = data.currentPage;
        $scope.nbPages = data.totalItems / data.perPage|0 + 1;


        /**
         * Link to page number of the list
         *
         * @param {int} number
         */
        $scope.setPage = function (number) {
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
        $scope.range = function(min, max){
            var input = [];
            for (var i = min; i <= max; i ++) input.push(i);
            return input;
        };

        /**
         * Return 'even'|'odd' based on the index parameter
         *
         * @param int index
         * @returns {string}
         */
        $scope.itemClass = function(index) {
            return (index % 2 === 0) ? 'even' : 'odd';
        }

        /**
         * Link to entity creation page
         */
        $scope.create = function() {
            $location.path('/create/' + data.entityName);
            $anchorScroll(0);
        }

        /**
         * Link to edit entity page
         *
         * @param {Object} item
         */
        $scope.edit = function(item) {
            $location.path('/edit/' + data.entityName + '/' + item[identifierField]);
            $anchorScroll(0);
        };
    });
});
