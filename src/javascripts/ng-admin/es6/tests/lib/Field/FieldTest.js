var assert = require('chai').assert;

import Entry from "../../../lib/Entry";
import Field from "../../../lib/Field/Field";

describe('Field', function() {
    describe('detailLink', function() {
        it('should be false if not specified', function() {
            var field = new Field('foo');
            assert.equal(false, field.isDetailLink());
        });

        it('should be true if not specified and if name is "id"', function() {
            var field = new Field('id');
            assert.equal(true, field.isDetailLink());
        });

        it('should return given value if already set, whatever name may be', function() {
            var field = new Field('id');
            field.detailLink = false;

            assert.equal(false, field.isDetailLink());
        });
    });

    describe('label', function() {
        it('should be based on name if non has been provided', function() {
            var field = new Field('first_name');
            assert.equal('First Name', field.label());
        });

        it('should be given value if already provided', function() {
            var field = new Field('first_name').label('Prénom');
            assert.equal('Prénom', field.label());
        });
    });

    describe('getCssClasses', function() {
        var field;

        beforeEach(function() {
            field = new Field('title');
        });

        it('should return result of callback called with entry if function', function() {
            field.cssClasses(entry => entry.values.id % 2 ? "odd-entry" : "even-entry");

            var entry = new Entry('post', { id: 1 });
            assert.equal("odd-entry", field.getCssClasses(entry));

            entry = new Entry('post', { id: 2 });
            assert.equal("even-entry", field.getCssClasses(entry));
        });

        it('should concatenate all elements if array', function() {
            field.cssClasses(["important", "approved"]);
            assert.equal("important approved", field.getCssClasses());
        });

        it('should return passed classes if neither function nor array', function() {
            field.cssClasses("important approved");
            assert.equal("important approved", field.getCssClasses());
        });
    });
});
