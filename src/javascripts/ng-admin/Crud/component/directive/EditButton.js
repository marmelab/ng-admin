/*global define*/

define(function (require) {
  'use strict';

  var editButtonTemplate = require('text!../../view/edit-button.html');

  function EditButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'entry': '&'
        },
        template: editButtonTemplate,
        link: function ($scope) {
            $scope.gotoEdit = function () {
                var entity = $scope.entity();
                $location.path('/edit/' + entity.name() + '/' + $scope.entry().values[entity.identifier().name()]);
            };
        }
    };
  }

  EditButtonDirective.$inject = ['$location'];

  return EditButtonDirective;
});
