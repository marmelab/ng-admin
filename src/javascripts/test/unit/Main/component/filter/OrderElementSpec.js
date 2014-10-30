/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var OrderElement = require('ng-admin/Main/component/filter/OrderElement');

    describe("Filter: OrderElement", function () {

        it('should order all elements', function () {
            var orderElement = new OrderElement('view1');

            var elements = [
                {order: function () { return 1; }, name: 'field1'},
                {order: function () { return 0; }, name: 'field2'},
                {order: function () { return 3; }, name: 'field3'}
            ];

            var orderedElements = orderElement(elements);

            // Check that elements are ordered
            expect(orderedElements.length).toEqual(3);
            expect(orderedElements[0].name).toEqual('field2');
            expect(orderedElements[1].name).toEqual('field1');
            expect(orderedElements[2].name).toEqual('field3');
        });

    });
});
