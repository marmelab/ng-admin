'use strict';

angular.module('angularAdminApp').controller('ListCtrl', function ($scope, $location, data) {

    var entityConfig = data.entityConfig,
        rawItems = data.rawItems,
        columns = [],
        identifierField = 'id';

    // Get identifier field, and build columns array (only field defined with `"list" : true` in config file)
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

    $scope.options = {
        grid : {
            dimensions : [ columns.length, rawItems.length ]
        }
    };
    $scope.columns = columns;
    $scope.items = rawItems;

    $scope.itemClass = function(index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    }

    $scope.create = function() {
        $location.path('/create/' + data.entityName);
    }

    $scope.edit = function(item) {
        $location.path('/edit/' + data.entityName + '/' + item[identifierField]);
    };
});
