define([
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field',
    'lib/config/Reference',
    'lib/config/ReferencedList',
    'lib/config/ReferenceMany'
], function (Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
    "use strict";

    function truncate(value) {
        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    var post = Entity('posts'),
        commentBody = Field('body'),
        postId = Field('id'),
        postCreatedAt = Field('created_at');

    var tag = Entity('tags')
        .order(3)
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
        .order(2)
        .label('Comments')
        .description('Lists all the blog comments with an infinite pagination')
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
            .dashboard(false)
            .targetEntity(post)
            .targetLabel('title')
    )
        .addField(commentBody
            .order(2)
            .type('text')
            .label('Comment')
            .edition('editable')
            .truncateList(truncate)
            .validation({
                "required": true,
                "max-length" : 150
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
    );

    post
        .label('Posts')
        .order(1)
        .dashboard(null)
        .perPage(10)
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        .titleCreate('Create a post')
        .titleEdit('Edit a post')
        .description('Lists all the blog posts with a simple pagination')
        .addField(Field('id')
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
    )
        .addField(Field('title')
            .label('Title')
            .edition('editable')
            .truncateList(truncate)
    )
        .addField(Field('body')
            .label('Body')
            .type('text')
            .edition('editable')
            .truncateList(truncate)
    )
        .addField(ReferencedList('comments')
            .label('Comments')
            .targetEntity(comment)
            .targetField('post_id')
            .targetFields([postId, commentBody])
    )
        .addField(ReferenceMany('tags')
            .label('Tags')
            .targetEntity(tag)
            .targetLabel('name')
    );

    return Application('ng-admin backend demo')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(post)
        .addEntity(comment)
        .addEntity(tag);
});
