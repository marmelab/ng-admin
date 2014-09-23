define(function(require) {
    'use strict';

    var angular = require('angular');

    function InfinitePagination($window, $document) {
        return {
            link:function (scope, element, attrs) {
                var offset = parseInt(attrs.threshold) || 0,
                    body = $document[0].body;

                angular.element($window).bind('scroll', function () {
                    if (scope.$eval(attrs.canLoad) && (body.offsetHeight - $window.innerHeight - $window.scrollY < offset)) {
                        scope.$apply(attrs.infinitePagination);
                    }
                });
            }
        };
    }

    InfinitePagination.$inject = ['$window', '$document'];

    return InfinitePagination;
});
