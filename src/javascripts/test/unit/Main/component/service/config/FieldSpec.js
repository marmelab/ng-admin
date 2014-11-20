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

                expect(field.name()).not.toBe(null);
            });

            it('should camelCase the name as the label by default.', function () {
                var field = new Field('myField');

                expect(field.label()).toEqual('MyField');
            });

            it('should accept string for template value.', function () {
                var field = new Field('myField')
                    .type('template')
                    .template('hello!');

                expect(field.getTemplateValue()).toEqual('hello!');
            });

            it('should accept function for template value.', function () {
                var field = new Field('myField')
                    .type('template')
                    .template(function () { return 'hello function !'; });

                expect(field.getTemplateValue()).toEqual('hello function !');
            });

            it('should not allows type other type.', function () {
                var field = new Field();

                expect(function () { field.type('myType');  })
                    .toThrow('Type should be one of : "number", "string", "text", "wysiwyg", "email", "date", "boolean", "choice", "choices", "password", "template" but "myType" was given.');
            });

        });

        describe('entity', function () {
            it('should set view.', function () {
                var field = new Field('field1'),
                    view = new ListView('list1');

                view.setEntity(new Entity('myEntity1'));
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
