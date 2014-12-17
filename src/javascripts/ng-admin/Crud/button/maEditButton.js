/*global define*/

define(function (require) {
    'use strict';

    var editButtonTemplate = require('text!./EditButton.html');

    function maEditButtonDirective($location) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'entry': '&',
                'size': '@'
            },
            template: editButtonTemplate,
            link: function ($scope) {
                $scope.gotoEdit = function () {
                    var entity = $scope.entity();
                    $location.path('/edit/' + entity.name() + '/' + $scope.entry().identifierValue);
                };
            }
        };
    }

    maEditButtonDirective.$inject = ['$location'];

    return maEditButtonDirective;
});
