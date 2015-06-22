/*global define*/

define(function (require) {
    'use strict';

    function ListActionsDirective() {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                'buttons': '&',
                'entry': '&',
                'entity': '&'
            },
            link: function ($scope) {
                $scope.buttons = $scope.buttons();
                $scope.entry = $scope.entry();
                $scope.entity = $scope.entity();
                $scope.customTemplate = false;
                if (typeof $scope.buttons === 'string') {
                    $scope.customTemplate = $scope.buttons;
                    $scope.buttons = null;
                }
            },
            template:
`<span compile="customTemplate">
    <span ng-repeat="button in ::buttons" ng-switch="button">
        <ma-show-button ng-switch-when="show" entry="::entry" entity="::entity" size="xs"></ma-show-button>
        <ma-edit-button ng-switch-when="edit" ng-if="::entity.editionView().enabled" entry="::entry" entity="::entity" size="xs"></ma-edit-button>
        <ma-delete-button ng-switch-when="delete" ng-if="::entity.deletionView().enabled" entry="::entry" entity="::entity" size="xs"></ma-delete-button>
        <span ng-switch-default><span compile="button"></span></span>
    </span>
</span>`
        };
    }

    return ListActionsDirective;
});
