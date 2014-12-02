/*global define*/

define(function (require) {
    'use strict';

    var listActionsTemplate = require('text!../../view/list-actions.html');

    function ListActionsDirective() {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                'buttons': '=',
                'entry': '=',
                'entity': '='
            },
            template: listActionsTemplate,
            link: function($scope) {
                $scope.customTemplate = false;
                if (typeof $scope.buttons == 'string') {
                    $scope.customTemplate = $scope.buttons;
                    $scope.buttons = null;
                }
            }
        };
    }

    return ListActionsDirective;
});
