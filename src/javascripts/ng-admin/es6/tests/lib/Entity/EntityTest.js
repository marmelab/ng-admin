var assert = require('chai').assert;

import Entity from "../../../lib/Entity/Entity";

describe('Entity', function() {
    describe('views', function() {
        it('should create all views when creating new entity', function() {
            var entity = new Entity('post');
            assert.deepEqual([
                'DashboardView',
                'MenuView',
                'ListView',
                'CreateView',
                'EditView',
                'DeleteView',
                'ShowView'
            ], Object.keys(entity.views));
        });
    });

    describe('label', function() {
        it('should return given label if already set', function() {
            var post = new Entity('post').label("Article");
            assert.equal('Article', post.label());
        });

        it('should return entity name if no label has been set', function() {
            var post = new Entity('post');
            assert.equal('Post', post.label());
        });
    });

    describe('readOnly()', function() {
        var entity;

        beforeEach(function() {
            entity = new Entity('post');
        });

        it('should not be read-only by default', function() {
            assert.equal(false, entity.isReadOnly);
        });

        it('should set read-only attribute', function() {
            entity.readOnly();
            assert.equal(true, entity.isReadOnly);
        }) ;

        it('should disable all edition views', function() {
            entity.readOnly();
            assert.equal(true, entity.menuView().enabled);
            assert.equal(true, entity.dashboardView().enabled);
            assert.equal(true, entity.listView().enabled);
            assert.equal(false, entity.creationView().enabled);
            assert.equal(false, entity.editionView().enabled);
            assert.equal(false, entity.deletionView().enabled);
        });
    })
});
