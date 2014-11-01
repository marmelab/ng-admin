/*global angular*/
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('customPostLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            template: '<a ng-click="displayPost(entity)">View&nbsp;post</a>',
            link: function ($scope) {
                $scope.displayPost = function (entity) {
                    var postId = entity.getField('post_id').value;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferenceMany, DashboardView, ListView, CreateView, EditView, DeleteView, Action) {
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

        var tag = new Entity('tags')
            .label('Tags')
            .order(3)
            .identifier(new Field('id'))
            .addView(new DashboardView('tag-dashboard')
                .order(2)
                .limit(10)
                .pagination(pagination)
                .label('Recent tags')
                .addField(new Field('name').label('Name').type('string'))
                .addField(new Field('published').label('Is published ?').type('boolean'))
                )
            .addView(new ListView('tags-list')
                .title('List of all tags')
                .infinitePagination(false)
                .pagination(pagination)
                .addAction(new Action('new-tag').label('Add tag').redirect('tags-create'))
                .addField(new Field('id').label('ID').identifier(true))
                .addField(new Field('name').label('Name').type('string'))
                .addField(new Field('published').label('Published').type('boolean'))
                .addField(new Field('actions')
                    .type('callback')
                    .list(true)
                    .label('Test')
                    .isEditLink(false)
                    .callback(function () {
                        return '{{ entry.getField("name").value.toUpperCase() }}';
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
                .addAction(new Action('delete-tag').label('Delete tag').redirect('tags-delete'))
                .listView('tags-list')
                .addField(new Field('name').label('Name').type('string').editable(true))
                .addField(new Field('published').label('Published').type('boolean'))
                )
            .addView(new DeleteView('tags-delete')
                .addField(new Field('name').label('Name').type('string').editable(false))
                .addField(new Field('published').label('Published').type('boolean'))
                );

        var post = new Entity('posts')
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
            //.addField(new ReferencedList('comments')
            //    .label('Comments')
            //    .targetEntity(comment)
            //    .targetField('post_id')
            //    .targetFields([commentId, commentBody])
            //)
                )
            .addView(new DeleteView('post-delete').title('Delete a post'));

        var comment = new Entity('comments')
            .order(2)
            .label('Comments')
            .addView(new DashboardView('comment-dashboard')
                .order(2)
                .limit(5)
                .pagination(pagination)
                .label('Last comments')
                .addField(new Field('title')
                    .label('Title')
                    .type('string')
                    .truncateList(truncate)
                    )
                .addField(new Reference('post_id')
                    .label('Title')
                    .truncateList(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title').label('Post title'))
                    )
                )
            .addView(new ListView('comment-list')
                .title('List of all comments with an infinite pagination')
                .infinitePagination(true)
                .pagination(pagination)
                .addField(new Field('title')
                    .label('Title')
                    )
                .addField(new Reference('post_id')
                    .label('Title')
                    .truncateList(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
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
                .addField(new Field('actions')
                    .type('callback')
                    .list(true)
                    .label('Actions')
                    .isEditLink(false)
                    .callback(function () {
                        return '<custom-post-link></custom-post-link>';
                    })
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
            //.addField(new ReferencedList('comments')
            //    .label('Comments')
            //    .targetEntity(comment)
            //    .targetField('post_id')
            //    .targetFields([commentId, commentBody])
            //)
                )
            .addView(new DeleteView('post-delete').title('Delete a post'));

        var app = new Application('ng-admin backend demo')
            .baseApiUrl('http://localhost:3000/')
            .addEntity(post)
            .addEntity(comment)
            .addEntity(tag);

        NgAdminConfigurationProvider.configure(app);
    });
}());
