/*global define*/

define(function (require) {
  'use strict';

  var deleteButtonTemplate = require('text!../../view/delete-button.html');

  function DeleteButtonDirective($location) {
    return {
        restrict: 'E',
        template: deleteButtonTemplate,
        link: function ($scope, $element, $attributes) {
            $scope.gotoDelete = function (entry) {
                var entity = $scope.view.getEntity();
                $location.path('/delete/' + entity.name() + '/' + entry.values[entity.identifier().name()]);
            };
        }
    };
  }

  DeleteButtonDirective.$inject = ['$location'];

  return DeleteButtonDirective;
});
