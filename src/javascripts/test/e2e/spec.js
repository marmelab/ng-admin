/*global describe,it,expect,$$,element,browser,by*/

describe('Dashboard', function () {
    'use strict';

    it('should display a navigation menu linking to all entities', function () {
        browser.get(browser.baseUrl);

        $$('.nav li').then(function (items) {
            expect(items.length).toBe(3);
            expect(items[0].getText()).toBe('Posts');
            expect(items[1].getText()).toBe('✉ Comments');
            expect(items[2].getText()).toBe('Tags');
        });
    });

    it('should display a panel for each entity with a list of recent items', function () {
        browser.get(browser.baseUrl);

        $$('.panel').then(function (panels) {
            expect(panels.length).toBe(3);

            expect(panels[0].all(by.css('.panel-heading')).first().getText()).toBe('Recent posts');
            expect(panels[1].all(by.css('.panel-heading')).first().getText()).toBe('Recent tags');
            expect(panels[2].all(by.css('.panel-heading')).first().getText()).toBe('Last comments');
        });
    });
});
