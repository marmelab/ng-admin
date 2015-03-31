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
                var openMenus = [];
                var listener = $rootScope.$on('$locationChangeSuccess', function() {
                    scope.path = $location.path();
                    render();
                });
                $rootScope.$on('$destroy', listener);
                scope.gotoLink = function (menu, $event) {
                    if (menu.hasChild()) {
                        if (openMenus.indexOf(menu) !== -1) {
                            openMenus.splice(openMenus.indexOf(menu), 1);
                        } else {
                            openMenus.push(menu);
                        }
                        $event.preventDefault();
                        $event.stopPropagation();
                        render();
                        return;
                    }
                    if (!menu.link()) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        return;
                    }
                    $location.search({});
                    $location.path(menu.link());
                };
                scope.isOpen = function(menu) {
                    return menu.isChildActive(scope.path) || openMenus.indexOf(menu) !== -1;
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
