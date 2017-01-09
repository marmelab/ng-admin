/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: ma-embedded-list-field', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/field/maEmbeddedListField');
    var Field = require('admin-config/lib/Field/Field');
    var EmbeddedListField = require('admin-config/lib/Field/EmbeddedListField');

    angular.module('testapp_EmbeddedListField', [])
        .directive('translate', () => ({
            restrict: 'A',
            scope: { translate: '@', translateValues: '=' },
            template: '{{ translate }} {{ translateValues.name }}'
        }))
        .directive('maEmbeddedListField', directive)
        .directive('maField', function() {
            return {
                scope: { value: '=' },
                template: '<input ng-model="value"></input>'
            };
        });

    var $compile,
        scope,
        directiveUsage = '<ma-embedded-list-field field="field" value="value" datastore="datastore"></ma-embedded-list-field>';

    beforeEach(angular.mock.module('testapp_EmbeddedListField'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it('should contain a list of subforms with bounded inputs', function () {
        scope.field = new EmbeddedListField('dummy')
            .targetFields([new Field('num'), new Field('name')]);
        scope.value = [{ num: 1, name: 'foo', dummy: 0 }, { num: 2, name: 'bar', dummy: 1 }];
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.find('ng-form').length).toBe(2);
        expect(element.find('input').length).toBe(4);
        expect(element.find('a').eq(0).text().trim()).toBe('REMOVE');
        expect(element.find('input').eq(0).scope().value).toBe(1);
        expect(element.find('input').eq(1).scope().value).toBe('foo');
        expect(element.find('a').eq(1).text().trim()).toBe('REMOVE');
        expect(element.find('input').eq(2).scope().value).toBe(2);
        expect(element.find('input').eq(3).scope().value).toBe('bar');
        expect(element.find('a').eq(2).text().trim()).toBe('ADD_NEW dummy');
    });

    describe('Add Button', () => {
        it('should display lower-cased label', () => {
            scope.field = new EmbeddedListField('dummy_field')
                .label('Awesome Entity');

            var element = $compile(directiveUsage)(scope);
            scope.$digest();

            expect(element[0].querySelector('span[translate]').textContent.trim()).toBe('ADD_NEW awesome entity');
        });
    });
});
