/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: ma-boolean-column', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/column/maBooleanColumn');
    var BooleanField = require('admin-config/lib/Field/BooleanField');

    angular.module('testapp_BooleanColumn', []).directive('maBooleanColumn', directive);

    var $compile,
        scope,
        directiveUsage = '<ma-boolean-column field="field" value="value"></ma-boolean-column>';

    beforeEach(angular.mock.module('testapp_BooleanColumn'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should contain a span tag", function () {
        scope.field = new BooleanField();
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].nodeName).toBe('SPAN');
    });

    it("should contain a span tag with classes glyphicon and glyphicon-ok when value is true", function () {
        scope.field = new BooleanField();
        scope.value = true;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].className).toBe('glyphicon glyphicon-ok');
    });

    it("should contain a span tag with classes glyphicon and glyphicon-remove when value is false", function () {
        scope.field = new BooleanField();
        scope.value = false;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].className).toBe('glyphicon glyphicon-remove');
    });

    it("should contain a span tag with classes glyphicon and glyphicon-ok when value is truthy", function () {
        scope.field = new BooleanField();
        scope.value = 1;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].className).toBe('glyphicon glyphicon-ok');
    });

    it("should contain a span tag with classes glyphicon and glyphicon-remove when value is falsy", function () {
        scope.field = new BooleanField();
        scope.value = 0;
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.children()[0].className).toBe('glyphicon glyphicon-remove');
    });
});
