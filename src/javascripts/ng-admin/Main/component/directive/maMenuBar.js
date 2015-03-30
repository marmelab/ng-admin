/*global define*/

define(function (require) {
    'use strict';

    var menuBarView = require('text!../../view/menuBar.html');

    function maMenuBar($location, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                'menu': '&'
            },
            link: function(scope) {
                scope.menu = scope.menu();
                scope.path = $location.path();
                $rootScope.$on('$locationChangeSuccess', function() {
                    scope.path = $location.path();
                });
                scope.gotoLink = function (link) {
                    $location.search({});
                    $location.path(link);
                };
            },
            template: menuBarView
        };
    }

    maMenuBar.$inject = ['$location', '$rootScope'];

    return maMenuBar;
});
