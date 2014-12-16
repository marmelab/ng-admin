/*global define*/

define(function (require) {
    'use strict';

    var listButtonTemplate = require('text!./ListButton.html');

    function maListButtonDirective($location) {
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

    maListButtonDirective.$inject = ['$location'];

    return maListButtonDirective;
});
