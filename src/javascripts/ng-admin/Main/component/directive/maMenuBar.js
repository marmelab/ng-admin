/*global define*/

define(function (require) {
    'use strict';

    var menuBarView = require('text!../../view/menuBar.html');

    function maMenuBar($location, $rootScope, $compile) {
        return {
            restrict: 'E',
            scope: {
                'menu': '&'
            },
            link: function(scope, element) {
                scope.menu = scope.menu();
                scope.path = $location.path();
                var listener = $rootScope.$on('$locationChangeSuccess', function() {
                    scope.path = $location.path();
                    render();
                });
                $rootScope.$on('$destroy', listener);
                scope.gotoLink = function (link) {
                    $location.search({});
                    $location.path(link);
                };
                render();
                // manually render on change to avoid checking menu.isActive at each dirty check
                function render() {
                    element.html(menuBarView);
                    $compile(element.contents())(scope);
                }
            }
        };
    }

    maMenuBar.$inject = ['$location', '$rootScope', '$compile'];

    return maMenuBar;
});
