/*global define*/

define(function (require) {
  'use strict';

  var showButtonTemplate = require('text!../../view/show-button.html');

  function ShowButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'entry': '&',
          'size': '@'
        },
        template: showButtonTemplate,
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
