define([], function () {
    'use strict';

    function InfinitePagination($famous) {
        return {
            'restrict': 'E',
            'scope': true,
            'link': function (scope) {
                var scrollView = $famous.find('#main-scroll')[0].renderNode;

                var updateInfinitePagination = function() {
                    if (!scrollView._node) {
                        return;
                    }

                    var index = scrollView._node.index;

                    console.log(index);
                };

                scrollView.sync.on('update', updateInfinitePagination);
                scrollView._scroller.on('edgeHit', updateInfinitePagination);
            }
        };
    }

    InfinitePagination.$inject = ['$famous'];

    return InfinitePagination;
});
