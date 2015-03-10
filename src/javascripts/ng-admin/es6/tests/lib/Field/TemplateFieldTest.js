var assert = require('chai').assert;

import TemplateField from "../../../lib/Field/TemplateField";

describe('TemplateField', function() {
    describe('template()', function() {
        it('should accept string values', function () {
            var field = new TemplateField().template('hello!');
            assert.equal(field.getTemplateValue(), 'hello!');
        });

        it('should accept function values', function () {
            var field = new TemplateField().template(function () { return 'hello function !'; });
            assert.equal(field.getTemplateValue(), 'hello function !');
        });
    });

    describe('getTemplateValue()', function() {
        it('should return the template function executed with the supplied data', function() {
            var field = new TemplateField().template(function (name) { return 'hello ' + name + ' !'; });
            assert.equal(field.getTemplateValue('John'), 'hello John !');
        });
    });
});
