/*global define*/

define(function (require) {
  'use strict';

  var deleteButtonTemplate = require('text!../../view/delete-button.html');

  function DeleteButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'entry': '&'
        },
        template: deleteButtonTemplate,
        link: function ($scope) {
            $scope.gotoDelete = function () {
                var entity = $scope.entity();
                $location.path('/delete/' + entity.name() + '/' + $scope.entry().values[entity.identifier().name()]);
            };
        }
    };
  }

  DeleteButtonDirective.$inject = ['$location'];

  return DeleteButtonDirective;
});
