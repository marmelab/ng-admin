(function() {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.config(function(ConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
        function truncate(value) {
            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        function pagination(page, maxPerPage) {
            return {
                offset: (page - 1) * maxPerPage,
                limit: maxPerPage
            }
        }

        var post = Entity('posts'),
            commentBody = Field('body'),
            postId = Field('id'),
            postCreatedAt = Field('created_at');

        var tag = Entity('tags')
            .order(3)
            .label('Tags')
            .dashboard(10)
            .pagination(pagination)
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
            .pagination(pagination)
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
            .pagination(pagination)
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

        var app = Application('ng-admin backend demo')
            .baseApiUrl('http://localhost:3000/')
            .addEntity(post)
            .addEntity(comment)
            .addEntity(tag);

        ConfigurationProvider.configure(app);
    })
})();
