/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: choices-field', function() {
        var directive = require('ng-admin/Crud/field/maChoicesField');
        var ChoiceField = require('ng-admin/es6/lib/Field/ChoiceField');
        angular.module('testapp_ChoicesField', []).directive('maChoicesField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-choices-field field="field" value="value"></ma-choices-field>';

        beforeEach(module('testapp_ChoicesField'));

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            scope = _$rootScope_;
        }));

        it("should contain a select multiple tag", function () {
            scope.field = new ChoiceField();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].nodeName).toBe('SELECT');
            expect(element.children()[0].multiple).toBeTruthy();
        });

        it("should add any supplied attribute", function () {
            scope.field = new ChoiceField().attributes({ disabled: true });
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.children()[0].disabled).toBeTruthy();
        });

        it("should contain the choices as options", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'bar'},
                {label: 'baz', value: 'bazValue'}
            ]);
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[0].innerHTML).toEqual('foo');
            expect(options[0].value).toEqual('bar');
            expect(options[1].innerHTML).toEqual('baz');
            expect(options[1].value).toEqual('bazValue');
        });

        it("should have the options with the bounded value selected", function () {
            scope.field = new ChoiceField().choices([
                {label: 'foo', value: 'fooValue'},
                {label: 'bar', value: 'barValue'},
                {label: 'baz', value: 'bazValue'}
            ]);
            scope.value = ['fooValue', 'bazValue'];
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            var options = element.find('option');
            expect(options[0].value).toEqual('fooValue');
            expect(options[0].selected).toBeTruthy();
            expect(options[1].value).toEqual('barValue');
            expect(options[1].selected).toBeFalsy();
            expect(options[2].value).toEqual('bazValue');
            expect(options[2].selected).toBeTruthy();
        });

    });
});
