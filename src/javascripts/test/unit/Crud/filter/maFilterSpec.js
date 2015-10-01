/*global angular,inject,describe,it,expect,beforeEach*/
describe('directive: ma-filter', function () {
    'use strict';

    var directive = require('../../../../ng-admin/Crud/filter/maFilter');
    var Field = require('admin-config/lib/Field/Field');
    angular.module('testapp_Filter', [])
        .directive('maFilter', directive)
        .service('FieldViewConfiguration', () => ({ string: { getFilterWidget: () => 'DUMMY' } }));

    var $compile,
        scope,
        directiveUsage = '<ma-filter field="::field" values="values" value="value" datastore="::dataStore"></ma-filter>';

    beforeEach(angular.mock.module('testapp_Filter'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it("should render the FilterWidget from the fieldView Configuration for that type", function () {
        scope.field = new Field('foo');
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.html()).toContain('DUMMY');
    });

    it("should render the Field template instead of the FilterWidget when set", function () {
        scope.field = new Field('foo').template('YOPLA');
        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.html()).not.toContain('DUMMY');
        expect(element.html()).toContain('YOPLA');
    });

});
