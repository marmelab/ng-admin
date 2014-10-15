/*global require,describe,module,beforeEach,inject,it,expect*/

define(function(require) {
    'use strict';

    var ListView = require('ng-admin/Main/component/service/config/view/ListView');

    describe("Service: ListView config", function() {

        it('should store quickfilter by name.', function() {
            var list = new ListView();

            list.addQuickFilter('Today', {'now': 1});

            expect(list.getQuickFilterNames()).toEqual(['Today']);
            expect(list.getQuickFilterParams('Today')).toEqual({'now': 1});
        });

    });
});
