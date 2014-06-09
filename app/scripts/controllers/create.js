define([
    'app',
    'humane',
    '../../scripts/services/getConfig',
    '../../scripts/services/panelBuilder'
], function(app, humane) {
    'use strict';

    app.controller('CreateCtrl', function ($scope, $location, crudManager, data) {
        $scope.fields = data.fields;
        $scope.entityLabel = data.entityLabel;

        angular.forEach(data.fields, function(field, name){
            field.value = null;
        });

        $scope.create = function(form, $event) {
            $event.preventDefault();

            var object = {};

            angular.forEach(data.fields, function(field, name){
                object[name] = field.value;
            });

            crudManager
                .createOne(data.entityName, object)
                .then(function(entity) {
                    humane.log('The object has been created.');
                     $location.path('/edit/' + data.entityName + '/' + entity.id);
                });
        };

        $scope.back = function() {
            $location.path('/list/' + data.entityName);
        }
    });
});
