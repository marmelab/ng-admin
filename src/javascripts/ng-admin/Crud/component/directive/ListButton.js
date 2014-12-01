/*global define*/

define(function (require) {
  'use strict';

  var listButtonTemplate = require('text!../../view/list-button.html');

  function ListButtonDirective($location) {
    return {
        restrict: 'E',
        scope: {
          'entity': '&',
          'size': '@'
        },
        template: listButtonTemplate,
        link: function ($scope) {
            $scope.gotoList = function () {
                $location.path('/list/' + $scope.entity().name());
            };
        }
    };
  }

  ListButtonDirective.$inject = ['$location'];

  return ListButtonDirective;
});
