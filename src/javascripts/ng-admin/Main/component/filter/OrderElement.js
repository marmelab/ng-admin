define(function() {
    'use strict';

    function OrderElement() {
        return function(input, attribute) {
            var results = [];

            for(var objectKey in input) {
                results.push(input[objectKey]);
            }

            results.sort(function(field1, field2){
                return field1.order() - field2.order();
            });

            return results;
        };
    }

    OrderElement.$inject = [];

    return OrderElement;
});
