define([
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field'
], function (Application, Entity, Field) {
    "use strict";

    return Application('My backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(Entity('posts')
            .label('Posts')
            .dashboard(null)
            .pagination(false)
            .addField(Field('id')
                .label('ID')
                .type('number')
                .identifier(true)
                .edition('read-only')
            )
            .addField(Field('body')
                .label('Body')
                .edition('editable')
                .validation({
                    "required": true,
                    "max-length" : 150
                })
            )
        ).addEntity(Entity('comments')
            .label('Comments')
            .dashboard(null)
            .pagination(false)
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
        );
});
