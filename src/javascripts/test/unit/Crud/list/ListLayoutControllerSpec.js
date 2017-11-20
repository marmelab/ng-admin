/*global describe,it,expect,beforeEach*/
import ListLayoutController, {getCurrentSearchParam} from '../../../../ng-admin/Crud/list/ListLayoutController'

describe('ListLayoutController', function () {
    describe('constructor', () => {
        it('should update filters if initialized with any', () => {
            spyOn(ListLayoutController.prototype, 'updateFilters');
            spyOn(ListLayoutController, 'getCurrentSearchParam')
                .and.returnValue({});

            const $scope = {
                $watch: () => {},
                $on: () => {},
            };

            const $location = {
                path: () => '/my_entity',
                search: () => '',
            };

            const view = {
                getEntity: () => 'my_entity',
                batchActions: () => [],
                actions: () => [],
                filters: () => [{
                    my_column: 17,
                    pinned: () => true,
                }],
            };

            const listLayoutController = new ListLayoutController(
                $scope, null, null, $location, null, view, null
            );

            expect(ListLayoutController.prototype.updateFilters)
                .toHaveBeenCalled();
        });
    });


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
