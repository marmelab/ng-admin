/*global define*/

define(function () {
    'use strict';

    function maDeleteButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'entry': '&',
                'size': '@'
            },
            link: function (scope) {
                scope.gotoDelete = function () {
                    $state.go($state.get('delete'), { entity: scope.entity().name(), id: scope.entry().identifierValue });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoDelete()">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;Delete' +
'</a>'

        };
    }

    maDeleteButtonDirective.$inject = ['$state'];

    return maDeleteButtonDirective;
});
