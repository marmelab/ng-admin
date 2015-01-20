/*global angular*/
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('customPostLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            template: '<p class="form-control-static"><a ng-click="displayPost(entry)">View&nbsp;post</a></p>',
            link: function ($scope) {
                $scope.displayPost = function (entry) {
                    var postId = entry.values.post_id;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.directive('otherPageLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: true,
            template: '<p class="form-control-static"><a ng-click="changePage()">Change page</a></p>',
            link: function ($scope) {
                $scope.changePage = function () {
                    $location.path('/new-page');
                };
            }
        };
    }]);

    app.controller('NewPageController', function ($scope, $location) {
        $scope.title = 'Custom page';

        $scope.goToDashboard = function () {
            $location.path('dashboard');
        };
    });

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany, RestangularProvider, $stateProvider) {

        // Create a new route for a custom page
        $stateProvider
            .state('new-page', {
                parent: 'main',
                url: '/new-page',
                controller: 'NewPageController',
                controllerAs: 'listController',
                template: '<h1>{{ title }}</h1><a ng-click="goToDashboard()">Go to dashboard</a>'
            });

        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // use the custom query parameters function to format the API request correctly
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
            if (operation == "getList") {
                // custom pagination params
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
                delete params._page;
                delete params._perPage;
                // custom sort params
                if (params._sortField) {
                    params._sort = params._sortField;
                    delete params._sortField;
                }
                // custom filters
                if (params._filters) {
                    for (var filter in params._filters) {
                        params[filter] = params._filters[filter];
                    }
                    delete params._filters;
                }
            }
            return { params: params };
        });

        var app = new Application('ng-admin backend demo') // application main title
            .baseApiUrl('http://localhost:3000/'); // main API endpoint

        // define all entities at the top to allow references between them
        var post = new Entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id

        var comment = new Entity('comments')
            .baseApiUrl('http://localhost:3000/') // The base API endpoint can be customized by entity
            .identifier(new Field('id')); // you can optionally customize the identifier used in the api ('id' by default)

        var tag = new Entity('tags')
            .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

        // set the application entities
        app
            .addEntity(post)
            .addEntity(tag)
            .addEntity(comment);

        // customize entities and views

        post.menuView()
            .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

        post.dashboardView() // customize the dashboard panel for this entity
            .title('Recent posts')
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            .fields([new Field('title').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

        post.listView()
            .title('All posts') // default title is "[Entity_name] list"
            .description('List of posts with infinite pagination') // description appears under the title
            .infinitePagination(true) // load pages as the user scrolls
            .fields([
                new Field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
                new Field('title'), // the default list field type is "string", and displays as a string
                new Field('published_at').type('date'), // Date field type allows date formatting
                new Field('views').type('number'),
                new ReferenceMany('tags') // a Reference is a particular type of field that references another entity
                    .targetEntity(tag) // the tag entity is defined later in this file
                    .targetField(new Field('name')) // the field to be displayed in this list
            ])
            .listActions(['show', 'edit', 'delete']);

        post.creationView()
            .fields([
                new Field('title') // the default edit field type is "string", and displays as a text input
                    .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
                    .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
                new Field('teaser').type('text'), // text field type translates to a textarea
                new Field('body').type('wysiwyg'), // overriding the type allows rich text editing for the body
                new Field('published_at').type('date') // Date field type translates to a datepicker
            ]);

        post.editionView()
            .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
            .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
            .fields([
                post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
                new ReferenceMany('tags') // ReferenceMany translates to a select multiple
                    .targetEntity(tag)
                    .targetField(new Field('name'))
                    .cssClasses('col-sm-4'), // customize look and feel through CSS classes
                new Field('views')
                    .type('number')
                    .cssClasses('col-sm-4'),
                new ReferencedList('comments') // display list of related comments
                    .targetEntity(comment)
                    .targetReferenceField('post_id')
                    .targetFields([
                        new Field('id'),
                        new Field('body').label('Comment')
                    ])
            ]);

        post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .fields([
                new Field('id'),
                post.editionView().fields(), // reuse fields from another view in another order
                new Field('custom_action')
                    .type('template')
                    .template('<other-page-link></other-link-link>')
            ]);

        comment.menuView()
            .order(2) // set the menu position in the sidebar
            .icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>'); // you can even use utf-8 symbols!

        comment.dashboardView()
            .title('Last comments')
            .order(2) // display the comment panel second in the dashboard
            .limit(5)
            .fields([
                new Field('id'),
                new Field('body').label('Comment').map(truncate),
                new Field() // template fields don't need a name in dashboard view
                    .type('template') // a field which uses a custom template
                    .label('Actions')
                    .template('<custom-post-link></custom-post-link>') // you can use custom directives, too
            ]);

        comment.listView()
            .title('Comments')
            .perPage(10) // limit the number of elements displayed per page. Default is 30.
            .fields([
                new Field('created_at')
                    .label('Posted')
                    .type('date')
                    .order(1),
                new Field('body').map(truncate).order(3),
                new Reference('post_id')
                    .label('Post')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title').map(truncate))
                    .order(4),
                new Field('author').order(2)
            ])
            .filters([
                new Field('q').type('string').label('').attributes({'placeholder': 'Global Search'}),
                new Field('created_at')
                    .label('Posted')
                    .type('date')
                    .attributes({'placeholder': 'Filter by date'})
                    .format('yyyy-MM-dd'),
                new Field('today').type('boolean').map(function() {
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
            ])
            .listActions(['edit', 'delete']);

        comment.creationView()
            .fields([
                new Field('created_at')
                    .label('Posted')
                    .type('date')
                    .defaultValue(new Date()), // preset fields in creation view with defaultValue
                new Field('author'),
                new Field('body').type('wysiwyg'),
                new Reference('post_id')
                    .label('Post')
                    .map(truncate)
                    .targetEntity(post)
                    .targetField(new Field('title')),
            ]);

        comment.editionView()
            .fields(comment.creationView().fields())
            .fields([new Field()
                .type('template')
                .label('Actions')
                .template('<custom-post-link></custom-post-link>') // template() can take a function or a string
            ]);

        comment.deletionView()
            .title('Deletion confirmation'); // customize the deletion confirmation message

        tag.menuView()
            .order(3)
            .icon('<span class="glyphicon glyphicon-tags"></span>');

        tag.dashboardView()
            .title('Recent tags')
            .order(3)
            .limit(10)
            .fields([
                new Field('id'),
                new Field('name'),
                new Field('published').label('Is published ?').type('boolean')
            ]);

        tag.listView()
            .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
            .fields([
                new Field('id').label('ID'),
                new Field('name'),
                new Field('published').type('boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                    if (entry.values.published) {
                        return 'bg-success text-center';
                    }
                    return 'bg-warning text-center';
                }),
                new Field('custom')
                    .type('template')
                    .label('Upper name')
                    .template('{{ entry.values.name.toUpperCase() }}')
            ])
            .listActions(['show']);

        tag.showView()
            .fields([
                new Field('name'),
                new Field('published').type('boolean')
            ]);

        NgAdminConfigurationProvider.configure(app);
    });
}());
