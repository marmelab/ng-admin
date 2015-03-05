/*global define,angular,inject,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    describe('directive: json-field', function () {
        var directive = require('ng-admin/Crud/field/maJsonField');
        var Field = require('ng-admin/es6/lib/Field/Field');
        angular.module('testapp_JsonField', []).directive('maJsonField', directive);
        require('angular-mocks');

        var $compile,
            scope,
            directiveUsage = '<ma-json-field field="field" value="value"></ma-json-field>';

        beforeEach(module('testapp_JsonField'));

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

        it("should use an empty string for null values", function () {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('textarea').val()).toBe('');
        });

        it("should be initialized with the stringified bounded value as textarea value", function () {
            scope.field = new Field();
            scope.value = ["foo", { bar: 123 }];
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            expect(element.find('textarea').val()).toBe(JSON.stringify(JSON.parse('["foo",{"bar":123}]'), null, 2));
        });

        it("should convert the JSON string into a JavaScript object value", function () {
            scope.field = new Field();
            var element = $compile(directiveUsage)(scope);
            scope.$digest();
            element.find('textarea').val(JSON.stringify(JSON.parse('["foo",{"bar":456}]'), null, 2));
            // ngModel listens for "input" event
            // http://stackoverflow.com/questions/15739960/how-does-angularjs-internally-catch-events-like-onclick-onchange/15740287#15740287
            element.find('textarea').triggerHandler('input');
            scope.$digest();
            // We must compare on datas, because objects are different, even with same datas
            expect(JSON.stringify(scope.value)).toBe(JSON.stringify(["foo",{"bar":456}]));
        });

    });
});
