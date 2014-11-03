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

            it('should not allows type other type.', function () {
                var field = new Field();

                expect(function () { field.type('myType');  })
                    .toThrow(new Error('Type should be one of : "number", "string", "text", "wysiwyg", "email", "date", "boolean", "callback" but "myType" was given.'));
            });

        });

        describe('entity', function () {
            it('should set view.', function () {
                var field = new Field('field1'),
                    entity = new Entity('myEntity1'),
                    view = new ListView('list1');

                entity.addView(view);
                field.setView(view);

                expect(field.getSortName()).toBe('myEntity1.field1');
            });
        });

        describe('mapping', function () {
            it('should map all entity field.', function () {
                var field1 = new Field('field1'),
                    field2 = new Field('field1'),
                    entity = new Entity('myEntity1'),
                    list = new ListView('list1'),
                    dashboard = new DashboardView('dashboard1');

                entity
                    .addView(list)
                    .addView(dashboard);

                list.addField(field1);
                dashboard.addField(field2);

                field1.value('abc');

                expect(field2.value()).toBe('abc');
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
