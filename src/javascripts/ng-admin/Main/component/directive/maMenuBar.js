var menuBarView = require('../../view/menuBar.html');
var angular = require('angular');

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
            // manually render on change to avoid checking menu.isActive at each dirty check
            var listener = $rootScope.$on('$locationChangeSuccess', function() {
                scope.path = $location.path();
                render();
            });
            $rootScope.$on('$destroy', listener);
            scope.toggleMenu = function(menu) {
                // handle click on parent menu manually
                // because we chose bindOnce in the template for performance reasons
                if (openMenus.indexOf(menu) !== -1) {
                    // menu is already open, the click closes it
                    // except if a submenu is open
                    if (menu.isChildActive(scope.path)) {
                        return;
                    }
                    openMenus.splice(openMenus.indexOf(menu), 1);
                    closeMenu(menu);
                } else {
                    // menu is closed, the click opens it
                    openMenus.push(menu);
                    openMenu(menu);
                }
                // we don't render() in that case because it would cut the animation
                return;
            }
            scope.gotoLink = function (menu) {
                if (!menu.link()) {
                    return;
                }
                // close all open menus
                // no need to close the menus with animation using closeMenu(),
                // the menu will rerender anyway because of the listener on $locationChangeSuccess
                // so the animation don't work in that case
                openMenus = [];
                $location.search({});
                $location.path(menu.link());
            };
            scope.isOpen = function(menu) {
                return menu.isChildActive(scope.path) || openMenus.indexOf(menu) !== -1;
            };
            render();

            function render() {
                element.html(menuBarView);
                $compile(element.contents())(scope);
            }
            function closeMenu(menu) {
                var elements = getElementsForMenu(menu);
                elements.ul.addClass('collapsed');
                elements.arrow.removeClass('glyphicon-menu-down');
                elements.arrow.addClass('glyphicon-menu-right');
            }
            function openMenu(menu) {
                var elements = getElementsForMenu(menu);
                elements.ul.removeClass('collapsed');
                elements.arrow.removeClass('glyphicon-menu-right');
                elements.arrow.addClass('glyphicon-menu-down');
            }
            function getElementsForMenu(menu) {
                var parentLi;
                angular.forEach(element.find('li'), function(li) {
                    var liElement = angular.element(li);
                    if (liElement.attr('data-menu-id') == menu.uuid) {
                        parentLi = liElement;
                    }
                });
                return {
                    arrow: angular.element(parentLi.find('a')[0].getElementsByClassName('arrow')[0]),
                    ul: parentLi.find('ul').eq(0)
                };
            }
        }
    };
}

maMenuBar.$inject = ['$location', '$rootScope', '$compile'];

module.exports = maMenuBar;
