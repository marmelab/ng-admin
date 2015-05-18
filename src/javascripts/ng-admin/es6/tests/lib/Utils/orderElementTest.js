var assert = require('chai').assert;

import orderElement from "../../../lib/Utils/orderElement";

describe('orderElement', () => {

    describe("order()", () => {

        it('should order all elements', () => {
            var elements = [
                {order: function () { return 1; }, name: 'field1'},
                {order: function () { return 0; }, name: 'field2'},
                {order: function () { return 3; }, name: 'field3'}
            ];

            var orderedElements = orderElement.order(elements);

            // Check that elements are ordered
            assert.equal(orderedElements.length, 3);
            assert.equal(orderedElements[0].name, 'field2');
            assert.equal(orderedElements[1].name, 'field1');
            assert.equal(orderedElements[2].name, 'field3');
        });
    });
});
