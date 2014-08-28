define([
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field',
    'lib/config/Reference'
], function (Application, Entity, Field, Reference) {
    "use strict";

    var post = Entity('posts')
        .label('Posts')
        .dashboard(5)
        .pagination(null)
        .addField(Field('id')
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('title')
            .label('Title')
            .validation({
                "required": true,
                "max-length" : 150
            })
        ).addField(Field('body')
            .label('Body')
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
        .addField(Field('id')
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('body')
            .label('Comment')
            .edition('editable')
            .validation({
                "required": true,
                "max-length" : 150
            })
        )
        .addField(Reference('post_id')
            .label('Post')
            .targetEntity(post)
            .targetLabel('title')
        );

    return Application()
        .title('Backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(post)
        .addEntity(comment);
});
