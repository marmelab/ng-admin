/*global define*/

define(function () {
    'use strict';

    function maShowButtonDirective($state) {
        return {
            restrict: 'E',
            scope: {
                'entity': '&',
                'entry': '&',
                'size': '@'
            },
            link: function (scope) {
                scope.gotoShow = function () {
                    $state.go($state.get('show'), { entity: scope.entity().name(), id: scope.entry().identifierValue });
                };
            },
            template:
'<a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ng-click="gotoShow()">' +
    '<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>&nbsp;Show' +
'</a>'
        };
    }

    maShowButtonDirective.$inject = ['$state'];

    return maShowButtonDirective;
});
