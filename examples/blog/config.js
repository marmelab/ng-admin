var Factory = require('admin-config/lib/Factory');
var factory = new Factory();

var config = factory.application('ng-admin backend demo')
    .debug(false)
    .baseApiUrl('http://localhost:3000/');

function truncate(value) {
    if (!value) {
        return '';
    }

    return value.length > 50 ? value.substr(0, 50) + '...' : value;
}

var app = angular.module('myApp', ['ng-admin']);
app.config(['RestangularProvider', function (RestangularProvider) {
    // use the custom query parameters function to format the API request correctly
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
            }
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
}]);

// define all entities at the top to allow references between them
var post = factory.entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id
var comment = factory.entity('comments')
    .baseApiUrl('http://localhost:3000/') // The base API endpoint can be customized by entity
    .identifier(factory.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

var tag = factory.entity('tags')
    .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

// set the application entities
config
    .addEntity(post)
    .addEntity(tag)
    .addEntity(comment);

// customize entities and views
post.listView()
    .title('All posts') // default title is "[Entity_name] list"
    .description('List of posts with infinite pagination') // description appears under the title
    .infinitePagination(true) // load pages as the user scrolls
    .fields([
        factory.field('id').label('id'), // The default displayed name is the camelCase field name. label() overrides id
        factory.field('title'), // the default list field type is "string", and displays as a string
        factory.field('published_at', 'date'),  // Date field type allows date formatting
        factory.field('average_note', 'float'), // Float type also displays decimal digits
        factory.field('views', 'number'),
        factory.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
            .targetEntity(tag) // the tag entity is defined later in this file
            .targetField(factory.field('name')) // the field to be displayed in this list
    ])
    .listActions(['show', 'edit', 'delete']);

post.creationView()
    .fields([
        factory.field('title') // the default edit field type is "string", and displays as a text input
            .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
            .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
        factory.field('teaser', 'text'), // text field type translates to a textarea
        factory.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
        factory.field('published_at', 'date') // Date field type translates to a datepicker
    ]);

var subCategories = [
    { category: 'tech', label: 'Computers', value: 'computers' },
    { category: 'tech', label: 'Gadgets', value: 'gadgets' },
    { category: 'lifestyle', label: 'Travel', value: 'travel' },
    { category: 'lifestyle', label: 'Fitness', value: 'fitness' }
];

post.editionView()
    .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
    .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
    .fields([
        post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
        factory.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
            .choices([ // List the choice as object literals
                { label: 'Tech', value: 'tech' },
                { label: 'Lifestyle', value: 'lifestyle' }
            ]),
        factory.field('subcategory', 'choice')
            .choices(function(entry) { // choices also accepts a function to return a list of choices based on the current entry
                return subCategories.filter(function (c) {
                    return c.category === entry.values.category
                });
            }),
        factory.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
            .targetEntity(tag)
            .targetField(factory.field('name'))
            .filters(function(search) {
                return {
                    q: search
                }
            })
            .remoteComplete(true, { refreshDelay: 300 })
            .cssClasses('col-sm-4'), // customize look and feel through CSS classes
        factory.field('pictures', 'json'),
        factory.field('views', 'number')
            .cssClasses('col-sm-4'),
        factory.field('average_note', 'float')
            .cssClasses('col-sm-4'),
        factory.field('comments', 'referenced_list') // display list of related comments
            .targetEntity(comment)
            .targetReferenceField('post_id')
            .targetFields([
                factory.field('created_at').label('Posted'),
                factory.field('body').label('Comment')
            ])
            .sortField('created_at')
            .sortDir('DESC'),
        factory.field('', 'template').label('')
            .template('<span class="pull-right"><ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }" size="sm"></ma-filtered-list-button></span>')
    ]);

post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
    .fields([
        factory.field('id'),
        post.editionView().fields(), // reuse fields from another view in another order
        factory.field('custom_action', 'template')
            .label('')
            .template('<send-email post="entry"></send-email>')
    ]);

comment.listView()
    .title('Comments')
    .perPage(10) // limit the number of elements displayed per page. Default is 30.
    .fields([
        factory.field('created_at', 'date')
            .label('Posted'),
        factory.field('author'),
        factory.field('body', 'wysiwyg')
            .stripTags(true)
            .map(truncate),
        factory.field('post_id', 'reference')
            .label('Post')
            .map(truncate)
            .targetEntity(post)
            .targetField(factory.field('title').map(truncate))
    ])
    .filters([
        factory.field('q', 'template')
            .label('')
            .pinned(true)
            .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        factory.field('created_at', 'date')
            .label('Posted')
            .attributes({'placeholder': 'Filter by date'}),
        factory.field('post_id', 'reference')
            .label('Post')
            .targetEntity(post)
            .targetField(factory.field('title'))
            .remoteComplete(true, { refreshDelay: 300 })
    ])
    .listActions(['edit', 'delete']);

comment.creationView()
    .fields([
        factory.field('created_at', 'date')
            .label('Posted')
            .defaultValue(new Date()), // preset fields in creation view with defaultValue
        factory.field('author'),
        factory.field('body', 'wysiwyg'),
        factory.field('post_id', 'reference')
            .label('Post')
            .map(truncate)
            .filters(function(search) {
                if (!search) {
                    return;
                }

                return {
                    q: search // Full-text search
                };
            })
            .targetEntity(post)
            .targetField(factory.field('title'))
            .validation({ required: true })
            .remoteComplete(true, { refreshDelay: 0 })
    ]);

comment.editionView()
    .fields(comment.creationView().fields())
    .fields([factory.field(null, 'template')
        .label('')
        .template('<post-link entry="entry"></post-link>') // template() can take a function or a string
    ]);

comment.deletionView()
    .title('Deletion confirmation'); // customize the deletion confirmation message

tag.listView()
    .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
    .fields([
        factory.field('id').label('ID'),
        factory.field('name'),
        factory.field('published', 'boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
            if (entry.values.published) {
                return 'bg-success text-center';
            }
            return 'bg-warning text-center';
        }),
        factory.field('custom', 'template')
            .label('Upper name')
            .template('{{ entry.values.name.toUpperCase() }}')
    ])
    .batchActions([]) // disable checkbox column and batch delete
    .listActions(['show']);

tag.showView()
    .fields([
        factory.field('name'),
        factory.field('published', 'boolean')
    ]);

// customize header
var customHeaderTemplate =
'<div class="navbar-header">' +
    '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">{{ configuration.title() }}</a>' +
'</div>' +
'<p class="navbar-text navbar-right">' +
    '<a href="https://github.com/marmelab/ng-admin/blob/master/examples/blog/config.js"><span class="glyphicon glyphicon-sunglasses"></span>&nbsp;View Source</a>' +
'</p>';
config.header(customHeaderTemplate);

// customize menu
config.menu(factory.menu()
    .addChild(factory.menu(post).icon('<span class="glyphicon glyphicon-file"></span>')) // customize the entity menu icon
    .addChild(factory.menu(comment).icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>')) // you can even use utf-8 symbols!
    .addChild(factory.menu(tag).icon('<span class="glyphicon glyphicon-tags"></span>'))
    .addChild(factory.menu().title('Other')
        .addChild(factory.menu().title('Stats').icon('').link('/stats'))
    )
);

// customize dashboard
var customDashboardTemplate =
'<div class="row dashboard-starter"></div>' +
'<div class="row dashboard-content"><div class="col-lg-12"><div class="alert alert-info">' +
    'Welcome to the demo! Fell free to explore and modify the data. We reset it every few minutes.' +
'</div></div></div>' +
'<div class="row dashboard-content">' +
    '<div class="col-lg-12">' +
        '<div class="panel panel-default">' +
            '<ma-dashboard-panel collection="dashboardController.collections.comments" entries="dashboardController.entries.comments"></ma-dashboard-panel>' +
        '</div>' +
    '</div>' +
'</div>' +
'<div class="row dashboard-content">' +
    '<div class="col-lg-6">' +
        '<div class="panel panel-green">' +
            '<ma-dashboard-panel collection="dashboardController.collections.recent_posts" entries="dashboardController.entries.recent_posts"></ma-dashboard-panel>' +
        '</div>' +
        '<div class="panel panel-green">' +
            '<ma-dashboard-panel collection="dashboardController.collections.popular_posts" entries="dashboardController.entries.popular_posts"></ma-dashboard-panel>' +
        '</div>' +
    '</div>' +
    '<div class="col-lg-6">' +
        '<div class="panel panel-yellow">' +
            '<ma-dashboard-panel collection="dashboardController.collections.tags" entries="dashboardController.entries.tags"></ma-dashboard-panel>' +
        '</div>' +
    '</div>' +
'</div>';

config.dashboard(factory.dashboard()
    .addCollection(factory.collection(post)
        .name('recent_posts')
        .title('Recent posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
            factory.field('published_at', 'date').label('Published').format('MMM d'),
            factory.field('title').isDetailLink(true).map(truncate),
            factory.field('views', 'number')
        ])
        .sortField('published_at')
        .sortDir('DESC')
        .order(1)
    )
    .addCollection(factory.collection(post)
        .name('popular_posts')
        .title('Popular posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
            factory.field('published_at', 'date').label('Published').format('MMM d'),
            factory.field('title').isDetailLink(true).map(truncate),
            factory.field('views', 'number')
        ])
        .sortField('views')
        .sortDir('DESC')
        .order(3)
    )
    .addCollection(factory.collection(comment)
        .title('Last comments')
        .perPage(10)
        .fields([
            factory.field('created_at', 'date')
                .label('Posted'),
            factory.field('body', 'wysiwyg')
                .label('Comment')
                .stripTags(true)
                .map(truncate)
                .isDetailLink(true),
            factory.field('post_id', 'reference')
                .label('Post')
                .map(truncate)
                .targetEntity(post)
                .targetField(factory.field('title').map(truncate))
        ])
        .sortField('created_at')
        .sortDir('DESC')
        .order(2)
    )
    .addCollection(factory.collection(tag)
        .title('Tags publication status')
        .perPage(10)
        .fields([
            factory.field('name'),
            factory.field('published', 'boolean').label('Is published ?')
        ])
        .listActions(['show'])
        .order(4)
    )
    .template(customDashboardTemplate)
);

app.value('NgAdminConfiguration', config);

app.directive('postLink', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { entry: '&' },
        template: '<p class="form-control-static"><a ng-click="displayPost()">View&nbsp;post</a></p>',
        link: function (scope) {
            scope.displayPost = function () {
                $location.path('/posts/show/' + scope.entry().values.post_id);
            };
        }
    };
}]);

app.directive('sendEmail', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { post: '&' },
        template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>',
        link: function (scope) {
            scope.send = function () {
                $location.path('/sendPost/' + scope.post().values.id);
            };
        }
    };
}]);

// custom 'send post by email' page

function sendPostController($stateParams, notification) {
    this.postId = $stateParams.id;
    // notification is the service used to display notifications on the top of the screen
    this.notification = notification;
}
sendPostController.prototype.sendEmail = function() {
    if (this.email) {
        this.notification.log('Email successfully sent to ' + this.email, {addnCls: 'humane-flatty-success'});
    } else {
        this.notification.log('Email is undefined', {addnCls: 'humane-flatty-error'});
    }
};
sendPostController.$inject = ['$stateParams', 'notification'];

var sendPostControllerTemplate =
    '<div class="row"><div class="col-lg-12">' +
        '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
        '<div class="page-header">' +
            '<h1>Send post #{{ controller.postId }} by email</h1>' +
            '<p class="lead">You can add custom pages, too</p>' +
        '</div>' +
    '</div></div>' +
    '<div class="row">' +
        '<div class="col-lg-5"><input type="text" size="10" ng-model="controller.email" class="form-control" placeholder="name@example.com"/></div>' +
        '<div class="col-lg-5"><a class="btn btn-default" ng-click="controller.sendEmail()">Send</a></div>' +
    '</div>';

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('send-post', {
        parent: 'main',
        url: '/sendPost/:id',
        params: { id: null },
        controller: sendPostController,
        controllerAs: 'controller',
        template: sendPostControllerTemplate
    });
}]);

// custom page with menu item
var customPageTemplate = '<div class="row"><div class="col-lg-12">' +
        '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
        '<div class="page-header">' +
            '<h1>Stats</h1>' +
            '<p class="lead">You can add custom pages, too</p>' +
        '</div>' +
    '</div></div>';
app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('stats', {
        parent: 'main',
        url: '/stats',
        template: customPageTemplate
    });
}]);
