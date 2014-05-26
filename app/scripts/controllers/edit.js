'use strict';

angular.module('angularAdminApp').controller('EditCtrl', function ($scope, $location, crudManager, data) {
    $scope.fields = data.fields;
    $scope.entityLabel = data.entityLabel;

    $scope.edit = function(form, $event) {
        $event.preventDefault();

        var object = {};

        angular.forEach(data.fields, function(field, name){
            object[name] = field.value;
        });

        object.id = data.entityId;

        crudManager.updateOne(data.entityName, object);
    };

    $scope.create = function() {
        $location.path('/create/' + data.entityName);
    };

    $scope.delete = function() {
        $location.path('/delete/' + data.entityName + '/' + data.entityId);
    };

    $scope.return = function() {
        $location.path('/list/' + data.entityName);
    };
});
