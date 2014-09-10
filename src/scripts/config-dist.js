define([
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field',
    'lib/config/Reference',
    'lib/config/ReferencedList',
    'lib/config/ReferenceMany'
], function (Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
    "use strict";

    var post = Entity('posts'),
        commentBody = Field('body'),
        postId = Field('id'),
        postCreatedAt = Field('created_at'),
        commentTags = ReferenceMany('tags');

    var tag = Entity('tags')
        .label('Tags')
        .dashboard(10)
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        .infinitePagination(false)
        .addField(Field('id')
            .order(1)
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('name')
            .order(2)
            .label('Name')
            .edition('editable')
            .validation({
                "required": true,
                "max-length" : 150
            })
        );

    var comment = Entity('comments')
        .label('Comments')
        .dashboard(10)
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        .infinitePagination(true)
        .addField(postId
            .order(1)
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Reference('post_id')
            .targetEntity(post)
            .targetLabel('title')
        )
        .addField(commentBody
            .order(2)
            .type('text')
            .label('Comment')
            .edition('editable')
            .validation({
                "required": true,
                "max-length" : 150,
                "validator" : function(value) {
                    return value.indexOf('chat') > -1;
                }
            })
        )
        .addField(postCreatedAt
            .order(3)
            .label('Creation Date')
            .type('date')
            .edition('editable')
            .validation({
                "required": true
            })
        )
        .addField(commentTags
            .label('Tags')
            .targetEntity(tag)
            .targetLabel('name')
        );

    post
        .label('Posts')
        .dashboard(null)
        .pagination(false)
        .addField(Field('id')
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('title')
            .label('Title')
            .edition('editable')
        )
        .addField(Field('body')
            .label('Body')
            .type('text')
            .edition('editable')
        )
        .addField(ReferencedList('comments')
            .label('Comments')
            .targetEntity(comment)
            .targetField('post_id')
            .targetFields([postId, commentBody, commentTags])
        )
        .addField(ReferenceMany('tags')
            .label('Tags')
            .targetEntity(tag)
            .targetLabel('name')
        );

    return Application('My backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(post)
        .addEntity(comment)
        .addEntity(tag);
});
