/*global jasmine,angular,describe,it,expect*/
var stripTags = require('../../../../../ng-admin/Main/component/filter/StripTags')();

describe("Filter: StripTags", function () {
    'use strict';

    it('should remove all HTML tags', function () {
        expect(stripTags('With no tags')).toEqual('With no tags');
        expect(stripTags('With <strong>a single tag</strong>')).toEqual('With a single tag');
        expect(stripTags('With <em>two</em> different <strong>tags</strong>.')).toEqual('With two different tags.');
        expect(stripTags('With <span class="my-class" style="color: red;">some attributes</em>.')).toEqual('With some attributes.');
    });
});
