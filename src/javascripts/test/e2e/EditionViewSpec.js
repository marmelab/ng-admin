/*global describe,it,expect,$$,element,browser,by*/
describe('EditionViews', function () {
    'use strict';

    var hasToLoad = true;
    beforeEach(function() {
        if (hasToLoad) {
            browser.get(browser.baseUrl + '#/posts/edit/1');
            hasToLoad = false;
        }
    });

    describe('ChoiceField', function() {
        it('should render correctly choice fields', function () {
            $$('.ng-admin-field-category .ui-select-container').then(function (uiSelect) {
                expect(uiSelect.length).toBe(1);
            });
        });
    });
});
