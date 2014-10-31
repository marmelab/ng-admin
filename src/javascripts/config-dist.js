(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('customPostLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            template: '<a ng-click="displayPost(entry)">View&nbsp;post</a>',
            link: function ($scope) {
                $scope.displayPost = function (entry) {
                    var postId = entry.getField('post_id').value;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
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

        var post = new Entity('posts'),
            commentBody = new Field('body'),
            commentId = new Field('id');

        var tag = new Entity('tags')
            .label('Tags')
            .order(3)
            .dashboard(10)
            .pagination(pagination)
            .infinitePagination(false)
            .addField(new Field('id')
                .order(1)
                .label('ID')
                .type('number')
                .identifier(true)
                .edition('read-only')
            )
            .addField(new Field('name')
                .order(2)
                .label('Name')
                .edition('editable')
                .validation({
                    "required": true,
                    "max-length" : 150
                })
            ).addField(new Field('actions')
                .type('callback')
                .list(true)
                .label('Big Name')
                .isEditLink(false)
                .callback(function () {
                    return '{{ entry.getField("name").value.toUpperCase() }}';
                })
            );
        //
        var comment = new Entity('comments')
            .order(2)
            .label('Comments')
            .description('Lists all the blog comments with an infinite pagination')
            .dashboard(10)
            .pagination(pagination)
            .infinitePagination(true)
            .addField(commentId
                .order(1)
                .label('ID')
                .type('number')
                .identifier(true)
                .edition('read-only')
            )
            .addField(new Reference('post_id')
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
            .addField(new Field('created_at')
                .order(3)
                .label('Creation Date')
                .type('date')
                .edition('editable')
                .dashboard(false)
                .validation({
                    "required": true
                })
            ).addQuickFilter('Today', function () {
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
            .addField(new Field('id')
                .label('ID')
                .type('number')
                .identifier(true)
                .edition('read-only')
            )
            .addField(new Field('title')
                .label('Title')
                .edition('editable')
                .truncateList(truncate)
            )
            .addField(new Field('body')
                .label('Body')
                .type('text')
                .edition('editable')
                .truncateList(truncate)
            )
            .addField(new ReferencedList('comments')
                .label('Comments')
                .targetEntity(comment)
                .targetField('post_id')
                .targetFields([commentId, commentBody])
            )
            .addField(new ReferenceMany('tags')
                .label('Tags')
                .targetEntity(tag)
                .targetLabel('name')
            );

        var app = new Application('ng-admin backend demo')
            .baseApiUrl('http://localhost:3000/')
            .addEntity(post)
            .addEntity(comment)
            .addEntity(tag);

        NgAdminConfigurationProvider.configure(app);
    });
}());
