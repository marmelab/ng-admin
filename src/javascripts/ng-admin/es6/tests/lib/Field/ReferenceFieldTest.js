var assert = require('chai').assert;

import ReferenceField from "../../../lib/Field/ReferenceField";

describe('ReferenceField', function() {
    describe('detailLink', function() {
        it('should be a detail link by default', function() {
            var field = new ReferenceField('foo');
            assert.equal(true, field.isDetailLink());
        });
    });
});
