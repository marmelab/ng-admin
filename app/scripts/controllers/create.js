'use strict';

angular.module('angularAdminApp').controller('CreateCtrl', function ($scope, $location, crudManager, data) {


    $scope.fields = data.fields;
    $scope.entityLabel = data.entityLabel;

    $scope.create = function(form, $event) {
        $event.preventDefault();

        var object = {};

        angular.forEach(data.fields, function(field, name){
            object[name] = field.value;
        });

        crudManager.createOne(data.entityName, object);
    };

    $scope.return = function() {
        $location.path('/list/' + data.entityName);
    }
});
