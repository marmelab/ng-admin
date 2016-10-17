/*global describe,it,expect,beforeEach*/
describe('ListLayoutController', function () {
    var getCurrentSearchParam = require('../../../../ng-admin/Crud/list/ListLayoutController').getCurrentSearchParam;

    describe('getCurrentSearchParam', function () {
        it('should return search url parameter mapped by filter', function () {
            const location = {
                search: function () {
                    return { search: JSON.stringify({ name: 'doe' }) };
                }
            };

            const filters = [
                { pinned: function () { return false; }, name: function() { return 'name'; }, getMappedValue: function (value) { return `mapped name for ${value}`; } },
                { pinned: function () { return false; }, name: function() { return 'firstname'; }, getMappedValue: function (value) { return `mapped firstname for ${value}`; } }
            ];

            expect(getCurrentSearchParam(location, filters)).toEqual({ name: 'mapped name for doe' });
        });

        it('should add pinned filter defaultValue if not already set', function () {
            const location = {
                search: function () {
                    return { search: JSON.stringify({ name: 'doe' }) };
                }
            };

            const filters = [
                {
                    pinned: function () { return false; },
                    name: function() { return 'name'; },
                    getMappedValue: function (value) { return `mapped name for ${value}`; }
                },
                {
                    pinned: function () { return true; },
                    name: function() { return 'firstname'; },
                    getMappedValue: function (value) { return `mapped firstname for ${value}`; },
                    defaultValue: function (value) { return `default value for firstname`; }
                }
            ];

            expect(getCurrentSearchParam(location, filters))
            .toEqual({ name: 'mapped name for doe', firstname: 'mapped firstname for default value for firstname' });
        });

        it('should ignore pinned filter if location search has already a corresponding value', function () {
            const location = {
                search: function () {
                    return { search: JSON.stringify({ name: 'doe', firstname: 'john' }) };
                }
            };

            const filters = [
                {
                    pinned: function () { return false; },
                    name: function() { return 'name'; },
                    getMappedValue: function (value) { return `mapped name for ${value}`; }
                },
                {
                    pinned: function () { return true; },
                    name: function() { return 'firstname'; },
                    getMappedValue: function (value) { return `mapped firstname for ${value}`; },
                    defaultValue: function (value) { return `mapped firstname for default value for firstname`; }
                }
            ];

            expect(getCurrentSearchParam(location, filters))
            .toEqual({ name: 'mapped name for doe', firstname: 'mapped firstname for john' });
        });
    });
});
