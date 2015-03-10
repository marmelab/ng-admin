var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";
import MenuView from "../../../lib/View/MenuView";

describe('MenuView', function() {
    describe('icon', function() {
        it('should default to list glyphicon', function() {
            var view = new MenuView(new Entity('post'));
            assert.equal('<span class="glyphicon glyphicon-list"></span>', view.icon());
        });

        it('should be given icon otherwise', function() {
            var view = new MenuView(new Entity('post')).icon('<span class="glyphicon glyphicon-globe"></span>');
            assert.equal('<span class="glyphicon glyphicon-globe"></span>', view.icon());
        });
    });
});
