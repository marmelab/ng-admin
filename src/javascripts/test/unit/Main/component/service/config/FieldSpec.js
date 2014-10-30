/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity');

    describe("Service: Field config", function () {

        describe('type', function () {
            it('should set type string.', function () {
                var field = new Field();
                field.type('string');

                expect(field.type()).toBe('string');
            });

            it('should not allows type other type.', function () {
                var field = new Field();

                expect(function () { field.type('myType');  })
                    .toThrow(new Error('Type should be one of : "number", "string", "text", "wysiwyg", "email", "date", "callback", "myType" given.'));
            });

        });

        describe('entity', function () {
            it('should set entity.', function () {
                var field = new Field('field1'),
                    entity = new Entity('myEntity1');

                field.setEntity(entity);

                expect(field.getSortName()).toBe('myEntity1.field1');
            });
        });

        describe('config', function () {
            it('should call truncateListValue with a callback.', function () {
                function truncate(val) {
                    return 'v' + val;
                }

                var field = new Field('field1');
                field.truncateList(truncate);

                expect(field.getTruncatedListValue(123)).toBe('v123');
            });
        });

    });
});
