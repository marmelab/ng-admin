define([
    'app',
    'humane',
    '../../scripts/services/getConfig',
    '../../scripts/services/crudManager'
], function(app, humane) {
    'use strict';

    app.controller('EditCtrl', function ($scope, $location, crudManager, data) {
        $scope.fields = data.fields;
        $scope.entityLabel = data.entityLabel;

        $scope.edit = function(form, $event) {
            $event.preventDefault();

            var object = {
                id: data.entityId
            };

            angular.forEach(data.fields, function(field, name){
                object[name] = field.value;
            });

            if (crudManager.updateOne(data.entityName, object)) {
                humane.log('The object has been updated.');
            }
        };

        $scope.create = function() {
            $location.path('/create/' + data.entityName);
        };

        $scope.deleteOne = function() {
            $location.path('/delete/' + data.entityName + '/' + data.entityId);
        };

        $scope.back = function() {
            $location.path('/list/' + data.entityName);
        };
    });
});
