/*global define*/

define(function (require) {
  'use strict';

  var editButtonTemplate = require('text!../../view/show-button.html');

  function ShowButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'entry': '&',
          'size': '@'
        },
        template: editButtonTemplate,
        link: function ($scope) {
            $scope.gotoShow = function () {
                var entity = $scope.entity();
                $location.path('/show/' + entity.name() + '/' + $scope.entry().identifierValue);
            };
        }
    };
  }

  ShowButtonDirective.$inject = ['$location'];

  return ShowButtonDirective;
});
