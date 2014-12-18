/*global require,describe,module,beforeEach,inject,it,expect*/

define(function (require) {
    'use strict';

    var View = require('ng-admin/Main/component/service/config/view/View'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),
        Reference = require('ng-admin/Main/component/service/config/Reference');

    describe("Service: View config", function () {

        it('should returns it\'s name.', function () {
            var view = new View('view-abx');

            expect(view.name()).toEqual('view-abx');
        });

        it('should returns a title and description.', function () {
            var view = new View();
            view.title('my-title');
            view.description('my desc');

            expect(view.title()).toEqual('my-title');
            expect(view.description()).toEqual('my desc');
        });

        it('should add a return field types.', function () {
            var view = new View();
            var refMany = new ReferenceMany('refMany');
            var ref = new Reference('myRef');

            var field = new Field('body');

            view.addField(ref).addField(refMany).addField(field);

            expect(view.getFieldsOfType('ReferenceMany')['refMany'].name()).toEqual('refMany');
            expect(view.getReferences()['refMany'].name()).toEqual('refMany');
            expect(view.getReferences()['myRef'].name()).toEqual('myRef');
            expect(view.getFields()['body'].order()).toEqual(2);
        });

        it('should returns the identifier.', function () {
            var view = new View();
            view
                .addField(new Field('post_id').identifier(true))
                .addField(new Field('name').identifier(false));

            expect(view.identifier().name()).toEqual('post_id');
        });

        it('should map some raw entities', function () {
            var view = new View();
            view
                .addField(new Field('post_id').identifier(true))
                .addField(new Field('title'))
                .setEntity(new Entity());

            var entries = view.mapEntries([
                { post_id: 1, title: 'Hello', published: true},
                { post_id: 2, title: 'World', published: false},
                { post_id: 3, title: 'How to use ng-admin', published: false}
            ]);

            expect(entries.length).toEqual(3);
            expect(entries[0].identifierValue).toEqual(1);
            expect(entries[1].values.title).toEqual('World');
            expect(entries[1].values.published).toEqual(false);
        });

        it('should map some one entity when the identifier in not in the view', function () {
            var view = new View(),
                field = new Field('title'),
                entity = new Entity('posts');

            view
                .addField(field)
                .setEntity(entity);

            entity
                .identifier(new Field('post_id'));

            var entry = view.mapEntry({ post_id: 1, title: 'Hello', published: true});
            expect(entry.identifierValue).toEqual(1);
            expect(entry.values.title).toEqual('Hello');
        });

    });
});
