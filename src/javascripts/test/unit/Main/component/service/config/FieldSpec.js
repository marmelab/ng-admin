/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/Main/component/service/config/Field'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        DashboardView = require('ng-admin/Main/component/service/config/view/DashboardView'),
        Entity = require('ng-admin/Main/component/service/config/Entity');

    describe("Service: Field config", function () {

        describe('type', function () {
            it('should set type string.', function () {
                var field = new Field();
                field.type('string');

                expect(field.type()).toBe('string');
            });

            it('should set a random string as name when not set.', function () {
                var field = new Field();

                expect(field.name()).toNotEqual(null);
            });

            it('should not allows type other type.', function () {
                var field = new Field();

                expect(function () { field.type('myType');  })
                    .toThrow('Type should be one of : "number", "string", "text", "wysiwyg", "email", "date", "boolean", "choice", "choices", "password", "callback" but "myType" was given.');
            });

        });

        describe('entity', function () {
            it('should set view.', function () {
                var field = new Field('field1'),
                    entity = new Entity('myEntity1'),
                    view = new ListView('list1');

                entity.addView(view);
                field.setView(view);

                expect(field.getSortName()).toBe('list1.field1');
            });
        });

        describe('config', function () {
            it('should call getMappedValue.', function () {
                function truncate(val) {
                    return 'v' + val;
                }

                var field = new Field('field1');
                field.map(truncate);

                expect(field.getMappedValue(123)).toBe('v123');
            });
        });

    });
});
