var assert = require('chai').assert;

import MenuView from "../../../lib/View/MenuView";

describe('MenuView', function() {
    describe('icon', function() {
        it('should default to list glyphicon', function() {
            var view = new MenuView();
            assert.equal('<span class="glyphicon glyphicon-list"></span>', view.icon);
        });

        it('should be given icon otherwise', function() {
            var view = new MenuView();
            view.icon = '<span class="glyphicon glyphicon-globe"></span>';

            assert.equal('<span class="glyphicon glyphicon-globe"></span>', view.icon);
        });
    });
});
