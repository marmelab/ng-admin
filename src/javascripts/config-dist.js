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

        var app = new Application('ng-admin backend demo') // application main title
            .baseApiUrl('http://localhost:3000/'); // main API endpoint

        // define all entities at the top to allow references between them
        var post = new Entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id

        var comment = new Entity('comments')
            .identifier(new Field('id')) // you can optionally customize the identifier used in the api ('id' by default)
            .addMappedField(new Field('post_id')); // a field to be read from the API, even if not displayed in any view (used later in template field)

        var tag = new Entity('tags');

        // set the application entities
        app
            .addEntity(tag)
            .addEntity(post)
            .addEntity(comment);

        // customize entities and views
        post
            .order(1) // post should be the first item in the sidebar menu
            .addView(new DashboardView('post-dashboard') // initialize a view with a name to ease routing
                .order(1) // display the post panel first in the dashboard
                .limit(5) // limit the panel to the 5 latest posts
                .pagination(pagination) // use the custom pagination function to format the API request correctly
                .label('Recent posts')
                .addField(new Field('title').isEditLink(true).map(truncate))
            )
            .addView(new ListView('post-list') // initialize the datagrid
                .title('All posts') // default title is "List of posts"
                .pagination(pagination)
                .addField(new Field('id').label('ID'))
                .addField(new Field('title')) // the default list field type is "string", and displays as a string
                .addField(new ReferenceMany('tags') // a Reference is a particular type of field that references another entity
                    .targetEntity(tag) // the tag entity is defined later in this file
                    .targetField(new Field('name')) // the field to be displayed in this list
                )
            )
            .addView(new CreateView('post-create') // initialize the creation form
                .title('Add a new post') // default title is "Create a post"
                .addField(new Field('title')) // the default edit field type is "string", and displays as a text input
                .addField(new Field('body').type('wysiwyg')) // overriding the type allows rich text editing for the body
            )
            .addView(new EditView('post-edit') // initialize the edition form
                .addField(new Field('title'))
                .addField(new Field('body').type('wysiwyg'))
                .addField(new ReferenceMany('tags')
                    .targetEntity(tag)
                    .targetField(new Field('name'))
                )
                .addField(new ReferencedList('comments')
                    .targetEntity(comment)
                    .targetReferenceField('post_id')
                    .targetFields([
                        new Field('id'),
                        new Field('body').label('Comment')
                    ])
                )
            )
            .addView(new DeleteView('post-delete') // initialize the deletion confirmation page
                .title('Delete a post')
            );

        comment
            .order(2) // comment should be the second item in the sidebar menu
            .addView(new DashboardView('comment-dashboard')
                .order(2) // display the comment panel second in the dashboard
                .limit(5)
                .pagination(pagination)
                .label('Last comments')
                .addField(new Field('id'))
                .addField(new Field('body').label('Comment').map(truncate))
                .addField(new Field() // template fields don't need a name
                    .type('template') // a field which uses a custom template
                    .label('Actions')
                    .template(function () { // template() can take a function or a string
                        return '<custom-post-link></custom-post-link>'; // you can use custom directives, too
                    })
                )
            )
            .addView(new ListView('comment-list')
                .title('Comments')
                .description('List of all comments with an infinite pagination') // description appears under the title
                .pagination(pagination)
                .addField(new Field('id').label('ID'))
                .addField(new Reference('post_id')
                    .label('Post title')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                )
                .addField(new Field('body').map(truncate))
                .addField(new Field('created_at').label('Creation date').type('date'))
                .addQuickFilter('Today', function () { // a quick filter displays a button to filter the list based on a set of query parameters passed to the API
                    var now = new Date(),
                        year = now.getFullYear(),
                        month = now.getMonth() + 1,
                        day = now.getDate();
                    month = month < 10 ? '0' + month : month;
                    day = day < 10 ? '0' + day : day;
                    return {
                        created_at: [year, month, day].join('-') // ?created_at=... will be appended to the API call
                    };
                })
                )
            .addView(new CreateView('comment-create')
                .addField(new Reference('post_id')
                    .label('Post title')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                )
                .addField(new Field('body').type('wysiwyg'))
            )
            .addView(new EditView('comment-edit')
                .addField(new Reference('post_id')
                    .label('Post title')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title'))
                )
                .addField(new Field('body').type('wysiwyg'))
                .addField(new Field('created_at').label('Creation date').type('date'))
                .addField(new Field()
                    .type('template')
                    .label('Actions')
                    .template('<custom-post-link></custom-post-link>') // template() can take a function or a string
                )
                )
            .addView(new DeleteView('comment-delete')
                .title('Delete a comment')
            );

        tag
            .order(3)
            .addView(new DashboardView('tag-dashboard')
                .order(3)
                .limit(10)
                .pagination(pagination)
                .label('Recent tags')
                .addField(new Field('id').label('ID'))
                .addField(new Field('name'))
                .addField(new Field('published').label('Is published ?').type('boolean'))
            )
            .addView(new ListView('tags-list')
                .title('List of all tags')
                .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
                .pagination(pagination)
                .addField(new Field('id').label('ID'))
                .addField(new Field('name'))
                .addField(new Field('published').type('boolean'))
                .addField(new Field('custom')
                    .type('template')
                    .label('Upper name')
                    .template(function () {
                        return '{{ entry.values.name.toUpperCase() }}';
                    })
                )
            )
            .addView(new CreateView('tags-create')
                .addField(new Field('name')
                    .type('string')
                    .validation({
                        "required": true,
                        "max-length" : 150
                    })
                )
                .addField(new Field('published').type('boolean'))
            )
            .addView(new EditView('tags_edit')
                .addField(new Field('name').editable(false))
                .addField(new Field('published').type('boolean'))
            )
            .addView(new DeleteView('tags-delete')
                .title('Delete a tag')
            );

        NgAdminConfigurationProvider.configure(app);
    });
}());
