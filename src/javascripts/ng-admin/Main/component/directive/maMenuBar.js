var menuBarView = require('../../view/menuBar.html');
var angular = require('angular');

function maMenuBar($location, $rootScope, $compile, $timeout) {
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
            scope.gotoLink = function (menu) {
                if (menu.hasChild()) {
                    // handle click on parent menu manually
                    // because we chose bindOnce in the template for performance reasons
                    var parentLi;
                    angular.forEach(element.find('li'), function(li) {
                        var liElement = angular.element(li);
                        if (liElement.attr('data-menu-id') == menu.uuid) {
                            parentLi = liElement;
                        }
                    });
                    var arrow = angular.element(parentLi.find('a')[0].getElementsByClassName('arrow')[0]);
                    var ul = parentLi.find('ul').eq(0);
                    if (openMenus.indexOf(menu) !== -1) {
                        // menu is already open, the click closes it
                        // except if a submenu is open
                        if (menu.isChildActive(scope.path)) {
                            return;
                        }
                        openMenus.splice(openMenus.indexOf(menu), 1);
                        ul.addClass('collapsed');
                        arrow.removeClass('glyphicon-menu-down');
                        arrow.addClass('glyphicon-menu-right');
                    } else {
                        // menu is closed, the click opens it
                        openMenus.push(menu);
                        ul.removeClass('collapsed');
                        arrow.removeClass('glyphicon-menu-right');
                        arrow.addClass('glyphicon-menu-down');
                    }
                    // we don't render() in that case because it would cut the animation
                    return;
                }
                if (!menu.link()) {
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

maMenuBar.$inject = ['$location', '$rootScope', '$compile', '$timeout'];

module.exports = maMenuBar;
