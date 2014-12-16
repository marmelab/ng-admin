/*global define*/

define(function (require) {
    'use strict';

    var deleteButtonTemplate = require('text!./DeleteButton.html');

    function maDeleteButtonDirective($location) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'entry': '&',
                'size': '@'
            },
            template: deleteButtonTemplate,
            link: function ($scope) {
                $scope.gotoDelete = function () {
                    var entity = $scope.entity();
                    $location.path('/delete/' + entity.name() + '/' + $scope.entry().identifierValue);
                };
            }
        };
    }

    maDeleteButtonDirective.$inject = ['$location'];

    return maDeleteButtonDirective;
});
