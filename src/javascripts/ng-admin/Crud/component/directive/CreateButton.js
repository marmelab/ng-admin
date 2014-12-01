/*global define*/

define(function (require) {
  'use strict';

  var createButtonTemplate = require('text!../../view/create-button.html');

  function CreateButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'size': '@'
        },
        template: createButtonTemplate,
        link: function ($scope) {
            $scope.gotoCreate = function () {
                $location.path('/create/' + $scope.entity().name());
            };
        }
    };
  }

  CreateButtonDirective.$inject = ['$location'];

  return CreateButtonDirective;
});
