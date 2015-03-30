var assert = require('chai').assert;

import Menu from "../../../lib/Menu/Menu";
import Entity from "../../../lib/Entity/Entity";

describe('Menu', () => {

    describe('constructor', () => {
        it('should return an empty menu', () => {
            var menu = new Menu();
            assert.isNull(menu.link());
            assert.isNull(menu.title());
            assert.isNull(menu.icon());
            assert.deepEqual([], menu.children());
            assert.isNull(menu.template());
        })
    });

    describe('link', () => {
        it('should set link and active function', () => {
            var menu = new Menu().link('/foo/bar');
            assert.equal('/foo/bar', menu.link());
            assert.isTrue(menu.isActive('/foo/bar'));
        });
        it('should return link when called with no argument', () =>
            assert.equal('/foo/bar', new Menu().link('/foo/bar').link())
        );
    });

    describe('isActive', () => {
        it('should return false by default', () => 
            assert.isFalse(new Menu().isActive())
        );
        it('should return true for the link', () =>
            assert.isTrue(new Menu().link('/foo').isActive('/foo'))
        );
        it('should return true for the link followed by something else', () =>
            assert.isTrue(new Menu().link('/foo').isActive('/foo/bar'))
        );
        it('should return false for something different than link', () =>
            assert.isFalse(new Menu().link('/foo/bar').isActive('/foo/far'))
        );
    });

    describe('active', () => {
        it('should override the function used to determine if the menu is active', () =>
            assert.isTrue(new Menu().link('/foo/bar').active(() => true).isActive('/foo/far'))
        );
    });

    describe('addChild', () => {
        it('should not accept anything other than a Menu', () =>
            assert.throw(() => new Menu().addChild('foo'))
        );
        it('should add a Child Menu', () => {
            var menu = new Menu();
            assert.isFalse(menu.hasChild());
            var submenu = new Menu();
            menu.addChild(submenu);
            assert.isTrue(menu.hasChild());
            assert.deepEqual([submenu], menu.children());
        });
    });

    describe('icon', () => {
        it('should return null by default', () => assert.isNull(new Menu().icon()));
        it('should set the icon', () => assert.equal('foo', new Menu().icon('foo').icon()))
    });

    describe('template', () => {
        it('should return null by default', () => assert.isNull(new Menu().template()));
        it('should set the template', () => assert.equal('foo', new Menu().template('foo').template()))
    });

    describe('fromEntity', () => {
        it('should fail if passed anything else than an Entity', () => {
            assert.throw(() => Menu.fromEntity('foo'), 'fromEntity() only accepts an Entity parameter')
        });
        it('should set label according to Entity', () => {
            assert.equal('Comments', Menu.fromEntity(new Entity('comments')).title());
        });
        it('should set link according to entity', () => {
            assert.equal('/list/comments', Menu.fromEntity(new Entity('comments')).link());
        });
    });

});
