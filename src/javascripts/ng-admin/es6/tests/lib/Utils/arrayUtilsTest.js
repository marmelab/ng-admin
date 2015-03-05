var assert = require('chai').assert;

import arrayUtils from "../../../lib/Utils/arrayUtils";

describe('Array Utils', function() {
    describe('.flatten', function() {
        it('should return null if no array given', function() {
            assert.equal(arrayUtils.flatten(), null);
        });

        it('should flatten array effectively', function() {
            var arr = [1, 2, ["hello", "world"], { name: "John" }];
            var flattenedArray = arrayUtils.flatten(arr);

            assert.deepEqual(flattenedArray, [1, 2, "hello", "world", { name: "John" }]);
        });
    });
});
