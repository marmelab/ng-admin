/*global angular*/
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('customPostLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            template: '<a ng-click="displayPost(entry)">View&nbsp;post</a>',
            link: function ($scope) {
                $scope.displayPost = function (entry) {
                    var postId = entry.values.post_id;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList,
                         ReferenceMany, DashboardView, ListView, CreateView, EditView, DeleteView) {

        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        function pagination(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: page * maxPerPage
            };
        }

        var comment = new Entity('comments'),
            tag = new Entity('tags'),
            post = new Entity('posts');

        post
            .label('Posts')
            .order(1)
            .identifier(new Field('id'))
            .addView(new DashboardView('post-dashboard')
                .order(1)
                .limit(5)
                .pagination(pagination)
                .label('Recent posts')
                .addField(new Field('title')
                    .label('Title')
                    .type('string')
                    .truncateList(truncate)
                    )
                )
            .addView(new ListView('post-list')
                .title('All posts')
                .infinitePagination(false)
                .pagination(pagination)
                .addField(new Field('id')
                    .label('ID')
                    )
                .addField(new Field('title')
                    .label('Title')
                    )
                .addField(new ReferenceMany('tags')
                    .label('Tags')
                    .isEditLink(false)
                    .targetEntity(tag)
                    .targetField(new Field('name'))
                    )
                )
            .addView(new CreateView('post-create')
                .title('Add a new post')
                .addField(new Field('title')
                    .label('Title')
                    .isEditLink(false)
                    .type('string')
                    )
                .addField(new Field('body')
                    .label('Body')
                    .isEditLink(false)
                    .type('wysiwyg')
                    )
                )
            .addView(new EditView('post-edit')
                .title('Edit a post')
                .addField(new Field('title')
                    .label('Title')
                    .isEditLink(false)
                    .type('string')
                    )
                .addField(new Field('body')
                    .label('Body')
                    .isEditLink(false)
                    .type('wysiwyg')
                    )
                .addField(new ReferenceMany('tags')
                    .label('Tags')
                    .isEditLink(false)
                    .targetEntity(tag)
                    .targetField(new Field('name'))
                    )
                .addField(new ReferencedList('comments')
                    .label('Comments')
                    .targetEntity(comment)
                    .targetReferenceField('post_id')
                    .targetFields([
                        new Field('id').label('ID'),
                        new Field('body').label('Comment')
                    ])
                    )
                )
            .addView(new DeleteView('post-delete')
                .title('Delete a post')
                );

        comment
            .order(2)
            .label('Comments')
            .identifier(new Field('id'))
            .addMappedField(new Field('post_id'))
            .addView(new DashboardView('comment-dashboard')
                .order(2)
                .limit(5)
                .pagination(pagination)
                .label('Last comments')
                .addField(new Field('id')
                    .label('ID')
                    )
                .addField(new Field('body')
                    .label('Comment')
                    .truncateList(truncate)
                    )
                .addField(new Field('actions')
                    .type('callback')
                    .label('Actions')
                    .isEditLink(false)
                    .callback(function () {
                        return '<custom-post-link></custom-post-link>';
                    })
                    )
                )
            .addView(new ListView('comment-list')
                .title('Comments')
                .description('List of all comments with an infinite pagination')
                .infinitePagination(true)
                .pagination(pagination)
                .addField(new Field('id')
                    .label('ID')
                    )
                .addField(new Reference('post_id')
                    .label('Post title')
                    .truncateList(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                    )
                .addField(new Field('body')
                    .label('Body')
                    .truncateList(truncate)
                    )
                .addField(new Field('created_at')
                    .label('Creation date')
                    .type('date')
                    )
                .addQuickFilter('Today', function () {
                    var now = new Date(),
                        year = now.getFullYear(),
                        month = now.getMonth() + 1,
                        day = now.getDate();

                    month = month < 10 ? '0' + month : month;
                    day = day < 10 ? '0' + day : day;

                    return {
                        created_at: [year, month, day].join('-')
                    };
                })
                )
            .addView(new CreateView('comment-create')
                .title('Add a new comment')
                .addField(new Reference('post_id')
                    .label('Post title')
                    .truncateList(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                    )
                .addField(new Field('body')
                    .label('Body')
                    .isEditLink(false)
                    .type('wysiwyg')
                    )
                )
            .addView(new EditView('comment-edit')
                .title('Edit a comment')
                .addField(new Reference('post_id')
                    .label('Post title')
                    .truncateList(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                    )
                .addField(new Field('body')
                    .label('Body')
                    .isEditLink(false)
                    .type('wysiwyg')
                    )
                .addField(new Field('created_at')
                    .label('Creation date')
                    .type('date')
                    )
                .addField(new Field('actions')
                    .type('callback')
                    .label('Actions')
                    .isEditLink(false)
                    .callback(function () {
                        return '<custom-post-link></custom-post-link>';
                    })
                    )
                )
            .addView(new DeleteView('comment-delete')
                .title('Delete a comment')
                );

        tag
            .label('Tags')
            .order(3)
            .identifier(new Field('id'))
            .addView(new DashboardView('tag-dashboard')
                .order(3)
                .limit(10)
                .pagination(pagination)
                .label('Recent tags')
                .addField(new Field('id').label('ID'))
                .addField(new Field('name').label('Name').type('string'))
                .addField(new Field('published').label('Is published ?').type('boolean'))
                )
            .addView(new ListView('tags-list')
                .title('List of all tags')
                .infinitePagination(false)
                .pagination(pagination)
                .addField(new Field('id').label('ID').identifier(true))
                .addField(new Field('name').label('Name').type('string'))
                .addField(new Field('published').label('Published').type('boolean'))
                .addField(new Field('custom')
                    .type('callback')
                    .label('Upper name')
                    .isEditLink(false)
                    .callback(function () {
                        return '{{ entry.values.name.toUpperCase() }}';
                    })
                    )
                )
            .addView(new CreateView('tags-create')
                .addField(new Field('name')
                    .label('Name')
                    .type('string')
                    .validation({
                        "required": true,
                        "max-length" : 150
                    })
                    )
                .addField(new Field('published').label('Published').type('boolean'))
                )
            .addView(new EditView('tags_edit')
                .addField(new Field('name').label('Name').type('string').editable(true))
                .addField(new Field('published').label('Published').type('boolean'))
                )
            .addView(new DeleteView('tags-delete')
                .title('Delete a tag')
                );

        var app = new Application('ng-admin backend demo')
            .baseApiUrl('http://localhost:3000/')
            .addEntity(post)
            .addEntity(comment)
            .addEntity(tag);

        NgAdminConfigurationProvider.configure(app);
    });
}());
