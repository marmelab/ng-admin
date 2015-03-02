/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var ReferencedListField = require('ng-admin/Main/component/service/config/fieldTypes/ReferencedListField'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        ReferenceManyField = require('ng-admin/Main/component/service/config/fieldTypes/ReferenceManyField'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        Entity = require('ng-admin/Main/component/service/config/Entity');

    describe("Service: config/fieldTypes/ReferencedList", function () {

        it('should retrieve referenceMany fields.', function () {
            var referencedList = new ReferencedListField('myField'),
                ref1 = new ReferenceManyField('ref1'),
                ref2 = new ReferenceManyField('ref2');

            referencedList.targetFields([ref1, ref2]);

            var references = referencedList.targetFields();

            expect(references.length).toBe(2);
            expect(references[0].name()).toBe('ref1');
        });

        it('should return information about grid column.', function () {
            var referencedList = new ReferencedListField('myField'),
                field1 = new Field('f1').label('Field 1'),
                field2 = new Field('f2').label('Field 2');

            referencedList.targetFields([field1, field2]);

            var columns = referencedList.getGridColumns();

            expect(columns.length).toBe(2);
            expect(columns[0].label).toBe('Field 1');
            expect(columns[1].field.name()).toBe('f2');
        });

        it('should store target entity configuration', function () {
            var comment = new Entity('comments');

            var post = new Entity('posts');
            post.editionView()
                .addField(new ReferencedListField('comments')
                    .targetEntity(comment)
                    .targetField(new Field('id'))
                );

            expect(post.getViewByType('EditView').getField('comments').targetEntity().listView()).not.toBe(null);
        });

    });
});
