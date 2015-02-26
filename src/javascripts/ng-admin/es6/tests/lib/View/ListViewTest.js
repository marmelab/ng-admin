var assert = require('chai').assert;

import ListView from "../../../lib/View/ListView";

describe('ListView', function() {
    describe('infinitePagination', function() {
        it('should be true if perPage is null', function() {
            var view = new ListView();
            view.perPage = 0;

            assert.equal(true, view.infinitePagination);
        });

        it('should be false otherwise', function() {
            var view = new ListView();
            view.perPage = 10;

            assert.equal(false, view.infinitePagination);
        });
    });
});
