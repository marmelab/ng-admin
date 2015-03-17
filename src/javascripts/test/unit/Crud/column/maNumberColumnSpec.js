/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: ma-number-column', function () {
        var directive = require('ng-admin/Crud/column/maNumberColumn');
        var NumberField = require('ng-admin/es6/lib/Field/NumberField');
        angular.module('testapp_NumberColumn', ['ngNumeraljs']).directive('maNumberColumn', directive);
        require('angular-mocks');
        require('numeral');
        require('angular-numeraljs');

        var $compile,
            scope,
            directiveUsage = '<ma-number-column field="field" value="value"></ma-number-column>';

        beforeEach(module('testapp_NumberColumn'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain a span tag", function () {
            scope.field = new NumberField();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].nodeName).toBe('SPAN');
        });

        it("should contain the bounded value with", function () {
            scope.field = new NumberField();
            scope.value = 123;
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('span').html()).toBe('123');
            scope.value = 456;
            scope.$digest();
            expect(element.find('span').html()).toBe('456');
        });

        it("should use the provided number format", function () {
            scope.field = new NumberField().format('$0,000.00');
            scope.value = 1234.5;
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('span').html()).toBe('$1,234.50');
        });
    });
});
