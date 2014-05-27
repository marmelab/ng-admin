'use strict';

angular.module('angularAdminApp').controller('CreateCtrl', function ($scope, $location, crudManager, data) {


    $scope.fields = data.fields;
    $scope.entityLabel = data.entityLabel;

    $scope.create = function(form, $event) {
        $event.preventDefault();

        var object = {};

        angular.forEach(data.fields, function(field, name){
            field.value = null;
        });

        crudManager.createOne(data.entityName, object).then(function(entityId) {
            humane.log('The object has been created.');
            $location.path('/edit/' + data.entityName + '/' + entityId);
        });
    };

    $scope.return = function() {
        $location.path('/list/' + data.entityName);
    }
});
