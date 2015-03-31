var assert = require('chai').assert;

import Menu from "../../../lib/Menu/Menu";
import Entity from "../../../lib/Entity/Entity";

describe('Menu', () => {

    describe('constructor', () => {
        it('should return an empty menu', () => {
            var menu = new Menu();
            assert.isNull(menu.link());
            assert.isNull(menu.title());
            assert.isFalse(menu.icon());
            assert.deepEqual([], menu.children());
            assert.isFalse(menu.template());
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

    describe('getChildByTitle', () => {
        it('should return undefined when no child', () => {
            assert.isUndefined(new Menu().getChildByTitle('foo'));
        });
        it('should return the first matching Menu', () => {
            let menu = new Menu();
            let fooMenu = new Menu().title('Foo');
            menu
                .addChild(fooMenu)
                .addChild(new Menu().title('Bar'));
            assert.deepEqual(fooMenu, menu.getChildByTitle('Foo'));
        })
    });

    describe('icon', () => {
        it('should return false by default', () => assert.isFalse(new Menu().icon()));
        it('should set the icon', () => assert.equal('foo', new Menu().icon('foo').icon()))
    });

    describe('template', () => {
        it('should return false by default', () => assert.isFalse(new Menu().template()));
        it('should set the template', () => assert.equal('foo', new Menu().template('foo').template()))
    });

    describe('populateFromEntity', () => {
        it('should fail if passed anything else than an Entity', () => {
            assert.throw(() => new Menu().populateFromEntity('foo'), 'populateFromEntity() only accepts an Entity parameter')
        });
        it('should set label according to Entity', () => {
            assert.equal('Comments', new Menu().populateFromEntity(new Entity('comments')).title());
        });
        it('should set link according to entity', () => {
            assert.equal('/comments/list', new Menu().populateFromEntity(new Entity('comments')).link());
        });
        it('should set active function to entity', () => {
            let menu = new Menu().populateFromEntity(new Entity('comments'));
            assert.isTrue(menu.isActive('/comments/list'));
            assert.isTrue(menu.isActive('/comments/edit/2'));
            assert.isFalse(menu.isActive('/posts/list'));
        });
        it('should set icon according to MenuView', () => {
            let entity = new Entity('comments');
            entity.menuView().icon('<foo>');
            assert.equal('<foo>', new Menu().populateFromEntity(entity).icon());
        });
    });

});
