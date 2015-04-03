var assert = require('chai').assert;

import fieldsUtils from "../../../lib/Utils/fieldsUtils";
import Field from "../../../lib/Field/Field";

describe('fieldsUtils', function() {
    describe('fieldsLiteralToArray', function() {

        it('should convert fields in literal form to array', function() {
            var a = new Field('a');
            var b = new Field('b');
            var c = new Field('c');
            var fields = {
                a: a,
                b: b,
                c: c
            }

            assert.deepEqual(fieldsUtils.fieldsLiteralToArray(fields), [a, b, c]);
        });

        it('should sort array using order if specified', function() {
            var a = new Field('a').order(3);
            var b = new Field('b').order(2);
            var c = new Field('c').order(1);
            var fields = {
                a: a,
                b: b,
                c: c,
            }

            assert.deepEqual(fieldsUtils.fieldsLiteralToArray(fields), [c, b, a]);
        });

        it('should return an array if given an array', function() {
            var a = new Field('a').order(3);
            var b = new Field('b').order(2);
            var c = new Field('c').order(1);
            var fields = [a,b,c];

            assert.deepEqual(fieldsUtils.fieldsLiteralToArray(fields), [c, b, a]);
        });
    });
});
