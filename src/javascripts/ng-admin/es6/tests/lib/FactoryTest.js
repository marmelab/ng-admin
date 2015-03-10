import Factory from "../../lib/Factory";
import Field from "../../lib/Field/Field";

var assert = require('chai').assert;

describe('Factory', function() {
    describe('field', function() {
        it('should return new field from given type with correct name if type is registered', function() {
            var factory = new Factory();
            class CustomField extends Field {
                constructor(name) {
                    super(name);
                    this._type = 'custom-string';
                }
            }

            factory.registerFieldType('custom-string', CustomField);

            var field = factory.field('title', 'custom-string');
            assert.equal('title', field.name());
            assert.equal('custom-string', field.type());
        });

        it('should throw an error if type has not been already registered', function() {
            var factory = new Factory();

            try {
                factory.field('title', 'non-existing-type');
            } catch(e) {
                assert.equal('Unknown field type "non-existing-type".', e.message);
                return;
            }

            assert.equal(true, false);
        });

        it('should return a string field by default', function() {
            var factory = new Factory();
            factory.registerFieldType('string', Field);

            var field = factory.field('title');
            assert.equal('string', field.type());
        });
    });
});
