/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var TemplateField = require('ng-admin/Main/component/service/config/fieldTypes/TemplateField');

    describe("Service: config/fieldTypes/TemplateField", function () {

        describe('template()', function () {

            it('should accept string values', function () {
                var field = new TemplateField().template('hello!');
                expect(field.getTemplateValue()).toEqual('hello!');
            });

            it('should accept function values', function () {
                var field = new TemplateField().template(function () { return 'hello function !'; });
                expect(field.getTemplateValue()).toEqual('hello function !');
            });

        });

        describe('getTemplateValue()', function() {
            it('should return the template function executed with the supplied data', function() {
                var field = new TemplateField().template(function (name) { return 'hello ' + name + ' !'; });
                expect(field.getTemplateValue('John')).toEqual('hello John !');
            });
        })
    });
});
