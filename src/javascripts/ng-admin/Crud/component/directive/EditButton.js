/*global define*/

define(function (require) {
  'use strict';

  var editButtonTemplate = require('text!../../view/edit-button.html');

  function EditButtonDirective($location) {
    return {
        restrict: 'E',
        template: editButtonTemplate,
        link: function ($scope, $element, $attributes) {
            $scope.gotoEdit = function (entry) {
                var entity = $scope.view.getEntity();
                $location.path('/edit/' + entity.name() + '/' + entry.values[entity.identifier().name()]);
            };
        }
    };
  }

  EditButtonDirective.$inject = ['$location'];

  return EditButtonDirective;
});
