/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var Field = require('ng-admin/es6/lib/Field/Field'),
        ListView = require('ng-admin/es6/lib/View/ListView'),
        DashboardView = require('ng-admin/es6/lib/View/DashboardView'),
        Entity = require('ng-admin/es6/lib/Entity/Entity');

    describe("Service: Field config", function () {

        describe('label()', function() {
            it('should return the camelCased name by default', function () {
                expect(new Field('myField').label()).toEqual('MyField');
                expect(new Field('my_field_1').label()).toEqual('My Field 1');
                expect(new Field('my-field-2').label()).toEqual('My Field 2');
                expect(new Field('my_field-3').label()).toEqual('My Field 3');
            });

            it('should allow to set a custom label', function () {
                var field = new Field('myField').label('foobar');
                expect(field.label()).toEqual('foobar');
            });

        });

        describe('map()', function() {
            it('should add a map function', function() {
                var fooFunc = function(a) { return a; }
                var field = new Field().map(fooFunc);
                expect(field.hasMaps()).toBeTruthy();
                expect(field.map()).toEqual([fooFunc]);
            });
            it('should allow multiple calls', function() {
                var fooFunc = function(a) { return a; }
                var barFunc = function(a) { return a + 1; }
                var field = new Field().map(fooFunc).map(barFunc);
                expect(field.map()).toEqual([fooFunc, barFunc]);
            });
        });

        describe('getMappedValue()', function() {
            it('should return the value argument if no maps', function() {
                var field = new Field();
                expect(field.getMappedValue('foobar')).toEqual('foobar');
            });
            it('should return the passed transformed by maps', function() {
                var field = new Field()
                    .map(function add1(a) { return a + 1; })
                    .map(function times2(a) { return a * 2; });
                expect(field.getMappedValue(3)).toEqual(8);
            });
        });

        describe('validation()', function() {
            it('should have sensible defaults', function() {
                expect(new Field().validation()).toEqual({required: false, minlength : 0, maxlength : 99999});
            });

            it('should allow to override parts of the validation settings', function() {
                var field = new Field().validation({ required: true });
                expect(field.validation()).toEqual({required: true, minlength : 0, maxlength : 99999});
            });

            it('should allow to remove parts of the validation settings', function() {
                var field = new Field().validation({ minlength: null });
                expect(field.validation()).toEqual({required: false, maxlength : 99999});
            });
        });

        describe('getCssClasses()', function() {
            it('should return an empty string by default', function() {
                var field = new Field();
                expect(field.getCssClasses()).toEqual('');
            });
            it('should return an class string as set by cssClasses(string)', function() {
                var field = new Field().cssClasses('foo bar');
                expect(field.getCssClasses()).toEqual('foo bar');
            });
            it('should return an class string as set by cssClasses(array)', function() {
                var field = new Field().cssClasses(['foo', 'bar']);
                expect(field.getCssClasses()).toEqual('foo bar');
            });
            it('should return an class string as set by cssClasses(function)', function() {
                var field = new Field().cssClasses(function() { return 'foo bar'; });
                expect(field.getCssClasses()).toEqual('foo bar');
            });
        });

    });
});
