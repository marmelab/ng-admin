/*global angular,inject,describe,it,expect,beforeEach,module*/
describe('directive: ma-menu-bar', function () {
    'use strict';

    var directive = require('../../../../../ng-admin/Main/component/directive/maMenuBar'),
        Menu = require('admin-config/lib/Menu/Menu'),
        Entity = require('admin-config/lib/Entity/Entity'),
        blog = new Entity('blog'),
        other = new Entity('other'),
        post = new Entity('post'),
        comment = new Entity('comment'),
        tag = new Entity('tag'),
        stats = new Entity('stats'),
        $compile,
        $location,
        scope,
        directiveUsage = '<ma-menu-bar menu="menu"></ma-nenu-bar>';

    angular.module('testapp_MenuBar', [])
        .directive('maMenuBar', directive);

    beforeEach(angular.mock.module('testapp_MenuBar'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$location_) {
        $compile = _$compile_;
        scope = _$rootScope_;
        $location = _$location_;
    }));

    it('should autoClose menu when autoClose is true', function () {
        var postMenu = new Menu(post).title('post').link('/post');
        var commentMenu = new Menu(comment).title('comment').link('/comment');
        var tagMenu = new Menu(tag).title('tag').link('/tag');
        var blogMenu = new Menu(blog).title('blog')
        .addChild(postMenu)
        .addChild(commentMenu);
        var statsMenu = new Menu(stats).title('stats').link('/stats');
        var otherMenu = new Menu(other).title('other')
        .addChild(statsMenu)
        .addChild(tagMenu);
        scope.menu = new Menu()
        .autoClose(true)
        .addChild(blogMenu)
        .addChild(otherMenu);

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(false);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(false);

        element.isolateScope().toggleMenu(otherMenu);
        element.isolateScope().activateLink(tagMenu);
        $location.url(tagMenu.link());
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(true);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(false);

        element.isolateScope().toggleMenu(blogMenu);
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(true);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(true);

        element.isolateScope().activateLink(postMenu);
        $location.url(postMenu.link());
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(false);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(true);
    });

    it('should not autoClose menu when autoClose is true', function () {
        var postMenu = new Menu(post).title('post').link('/post');
        var commentMenu = new Menu(comment).title('comment').link('/comment');
        var tagMenu = new Menu(tag).title('tag').link('/tag');
        var blogMenu = new Menu(blog).title('blog')
        .addChild(postMenu)
        .addChild(commentMenu);
        var statsMenu = new Menu(stats).title('stats').link('/stats');
        var otherMenu = new Menu(other).title('other')
        .addChild(statsMenu)
        .addChild(tagMenu);
        scope.menu = new Menu()
        .autoClose(false)
        .addChild(blogMenu)
        .addChild(otherMenu);

        var element = $compile(directiveUsage)(scope);
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(false);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(false);

        element.isolateScope().toggleMenu(otherMenu);
        element.isolateScope().activateLink(tagMenu);
        $location.url(tagMenu.link());
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(true);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(false);

        element.isolateScope().toggleMenu(blogMenu);
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(true);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(true);

        element.isolateScope().activateLink(postMenu);
        $location.url(postMenu.link());
        scope.$digest();
        expect(element.isolateScope().isOpen(otherMenu)).toBe(true);
        expect(element.isolateScope().isOpen(blogMenu)).toBe(true);
    });
});
