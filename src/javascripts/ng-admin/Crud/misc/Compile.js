/*global define*/
// @see https://docs.angularjs.org/api/ng/service/$compile

define(function () {
    'use strict';

    function Compile($injector) {
        var $compile = $injector.get('$compile');

        return {
            transclude: true,
            link: function (scope, element, attrs, controller, transcludeFn) {
                var unbindWatcher = scope.$watch(
                    function (scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function (value) {
                        if (false === value) {
                            // use the default tag content
                            transcludeFn(scope, function(clone) {
                                element.append(clone);
                            });
                            return;
                        }
                        // when the 'compile' expression changes assign it into the current DOM
                        element.html(value);

                        // compile the new DOM and link it to the current scope.
                        $compile(element.contents())(scope);

                        if (attrs.compileOnce == 'true') {
                            unbindWatcher();
                        };
                    }
                );
            }
        };
    }

    Compile.$inject = ['$injector'];

    return Compile;
});
