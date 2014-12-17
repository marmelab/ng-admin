/*global define*/

define(function (require) {
    'use strict';

    var createButtonTemplate = require('text!./CreateButton.html');

    function maCreateButtonDirective($location) {
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

    maCreateButtonDirective.$inject = ['$location'];

    return maCreateButtonDirective;
});
