/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: text-field', function () {
        var directive = require('ng-admin/Crud/field/maTextField');
        var Field = require('ng-admin/es6/lib/Field/Field');
        angular.module('testapp_TextField', []).directive('maTextField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-text-field field="field" value="value"></ma-text-field>';

        beforeEach(module('testapp_TextField'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain a textarea tag", function () {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].nodeName).toBe('TEXTAREA');
        });

        it("should add any supplied attribute", function () {
            scope.field = new Field().attributes({ placeholder: 'fill me!' });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].placeholder).toEqual('fill me!');
        });

        it("should contain the bounded value", function () {
            scope.field = new Field();
            scope.value = "foobar";
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('textarea').val()).toBe('foobar');
            scope.value = "baz";
            scope.$digest();
            expect(element.find('textarea').val()).toBe('baz');
        });

    });
});
