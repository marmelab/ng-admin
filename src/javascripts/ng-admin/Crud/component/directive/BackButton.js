/*global define*/

define(function (require) {
  'use strict';

  var backButtonTemplate = require('text!../../view/back-button.html');

  function BackButtonDirective($window) {
    return {
        restrict: 'E',
        scope: {
          'size': '@'
        },
        template: backButtonTemplate,
        link: function ($scope) {
            $scope.back = function () {
                 $window.history.back();
            };
        }
    };
  }

  BackButtonDirective.$inject = ['$window'];

  return BackButtonDirective;
});
