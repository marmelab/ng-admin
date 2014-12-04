describe('ng-admin dashboard', function() {
    describe('Controller: MainCtrl', function () {
        it('should work', function () {
            browser.get(browser.baseUrl);

            $$('.nav li').then(function (items) {
                expect(items.length).toBe(3);
                expect(items[0].getText()).toBe('Posts');
                expect(items[1].getText()).toBe('Tags');
                expect(items[2].getText()).toBe('Comments');
            });

            element.all(by.repeater('panel in dashboardController.panels')).then(function (panels) {
                expect(panels.length).toBe(3);

                expect(panels[0].all(by.css('.panel-heading')).first().getText()).toBe('Recent posts');
                expect(panels[1].all(by.css('.panel-heading')).first().getText()).toBe('Last comments');
                expect(panels[2].all(by.css('.panel-heading')).first().getText()).toBe('Recent tags');
            });
        })
    });
});