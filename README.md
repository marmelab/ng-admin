ng-admin [![Build Status](https://travis-ci.org/marmelab/ng-admin.png?branch=master)](https://travis-ci.org/marmelab/ng-admin)
========

Plug me to your RESTFul API to get a complete administration tool (CRUD, multi-model relationships, dashboard, complex form widgets) in no time!

[![http://static.marmelab.com/ng-admin.png](http://static.marmelab.com/ng-admin.png)](http://static.marmelab.com/ng-admin%20demo.mp4)

Check out the [online demo](http://ng-admin.marmelab.com/) ([source](https://github.com/marmelab/ng-admin-demo)), and the [launch post](http://marmelab.com/blog/2014/09/15/easy-backend-for-your-restful-api.html).

* [Installation](#installation)
* [Example Configuration](#example-configuration)
* [Entity Configuration](#entity-configuration)
* [View Configuration](#view-configuration)
* [Reusable Directives](#reusable-directives)
* [Relationships](#Relationships)
* [Customizing the API Mapping](#customizing-the-api-mapping)
* [Theming](#theming)
* [Contributing](#contributing)
* [License](#license)

## Installation

Retrieve the module from bower:

```sh
bower install ng-admin --save
```

Include the ng-admin CSS, and the ng-admin JS (after the angular.js JS):

```html
<link rel="stylesheet" href="/path/to/bower_components/ng-admin/build/ng-admin.min.css">
<script src="/path/to/bower_components/angular/angular.min.js" type="text/javascript"></script>
<script src="/path/to/bower_components/ng-admin/build/ng-admin.min.js" type="text/javascript"></script>
```

Make your application depend on it:
```js
var app = angular.module('myApp', ['ng-admin']);
```

Configure ng-admin:
```js
app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
    // set the main API endpoint for this admin
    var app = new Application('My backend')
        .baseApiUrl('http://localhost:3000/');

    // define an entity mapped by the http://localhost:3000/posts endpoint
    var post = app.addEntity('posts');

    // set the list of fields to map in each post view
    post.dashboardView().addField(/* see example below */);
    post.listView().addField(/* see example below */);
    post.creationView().addField(/* see example below */);
    post.editionView().addField(/* see example below */);
    
    NgAdminConfigurationProvider.configure(app);
});
```

Your application should use a `ui-view`:
```html
<div ui-view></div>
```

## Example Configuration

We chose to define the entities & views directly in JavaScript to allow greater freedom in the configuration.

Here is a full example for a backend that will let you create, update, and delete some posts (`posts` entity).
Those posts can be tagged (`tags` entity) and commented (`comments` entity).

```js

var app = angular.module('myApp', ['ng-admin']);

app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {

    var app = new Application('ng-admin backend demo') // application main title
        .transformParams(function(params) {
            // Sort by title by default
            if (typeof params._sort === 'undefined') {
                params._sort = 'title';
            }
            
            return params; 
        })
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // define all entities at the top to allow references between them
    var post = new Entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id
    var comment = new Entity('comments')
        .baseApiUrl('http://localhost:3000/') // Base API endpoint can be customized by entity
        .identifier(new Field('id')); // you can optionally customize the identifier used in the api ('id' by default)
    var tag = new Entity('tags')
        .url(function (view, entityId) { // API endpoint can be defined with string or a function in a entity
            return view + (entityId ? '/' + entityId : null);
        })
        .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

    // set the application entities
    app
        .addEntity(post)
        .addEntity(tag)
        .addEntity(comment);

    // customize entities and views

    post.menuView()
        .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

    post.dashboardView()
        .title('Recent posts')
        .order(1) // display the post panel first in the dashboard
        .limit(5) // limit the panel to the 5 latest posts
        .pagination(pagination) // use the custom pagination function to format the API request correctly
        .addField(new Field('title').isDetailLink(true).map(truncate));

    post.listView()
        .title('All posts') // default title is "[Entity_name] list"
        .pagination(pagination)
        .addField(new Field('id').label('ID'))
        .addField(new Field('title')) // the default list field type is "string", and displays as a string
        .addField(new ReferenceMany('tags') // a Reference is a particular type of field that references another entity
            .targetEntity(tag) // the tag entity is defined later in this file
            .targetField(new Field('name')) // the field to be displayed in this list
        )
        .listActions(['show', 'edit', 'delete']);

    post.creationView()
        .title('Add a new post') // default title is "Create a post"
        .addField(new Field('title')) // the default edit field type is "string", and displays as a text input
        .addField(new Field('body').type('wysiwyg')) // overriding the type allows rich text editing for the body

    post.editionView()
        .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
        .addField(new Field('title'))
        .addField(new Field('body').type('wysiwyg'))
        .addField(new ReferenceMany('tags')
            .targetEntity(tag)
            .targetField(new Field('name'))
            .cssClasses('col-sm-4') // customize look and feel through CSS classes
        )
        .addField(new ReferencedList('comments')
            .targetEntity(comment)
            .targetReferenceField('post_id')
            .targetFields([
                new Field('id'),
                new Field('body').label('Comment')
            ])
        );

    post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
        .addField(new Field('id'))
        .addField(new Field('title'))
        .addField(new Field('body').type('wysiwyg'))
        .addField(new ReferenceMany('tags') 
            .targetEntity(tag) 
            .targetField(new Field('name')) 
        );

    comment.menuView()
        .order(2) // set the menu position in the sidebar
        .icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>'); // you can even use utf-8 symbols!

    comment.dashboardView()
        .title('Last comments')
        .order(2) // display the comment panel second in the dashboard
        .limit(5)
        .pagination(pagination)
        .addField(new Field('id'))
        .addField(new Field('body').label('Comment').map(truncate))
        .addField(new Field() // template fields don't need a name
            .type('template') // a field which uses a custom template
            .label('Actions')
            .template(function () { // template() can take a function or a string
                return '<custom-post-link></custom-post-link>'; // you can use custom directives, too
            })
        );

    comment.listView()
        .title('Comments')
        .description('List of all comments with an infinite pagination') // description appears under the title
        .pagination(pagination)
        .addField(new Field('id').label('ID'))
        .addField(new Reference('post_id')
            .label('Post title')
            .map(truncate)
            .singleApiCall(function (postIds) { // If your API support it, you can pass the list of identifiers to retrieve (instead of retrieve element by element)
                return {
                    'post_id[]': postIds
                };
            })
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
        });

    comment.creationView()
        .addField(new Reference('post_id')
            .label('Post title')
            .map(truncate)
            .targetEntity(post)
            .targetField(new Field('title'))
        )
        .addField(new Field('body').type('wysiwyg'))
        .addField(new Field('created_at')
            .label('Creation date')
            .type('date') // to edit a date type field, ng-admin offers a datepicker
            .defaultValue(new Date()) // preset values with defaultValue
        );

    comment.editionView()
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
        );

    comment.deletionView()
        .title('Deletion confirmation'); // customize the deletion confirmation message

    tag.menuView()
        .order(3)
        .icon('<span class="glyphicon glyphicon-tags"></span>');

    tag.dashboardView()
        .url(function (entityId) { // API endpoint can be defined for a view with string or a function in a entity
            return view + (entityId ? '/' + entityId : null);
        })
        .title('Recent tags')
        .order(3)
        .limit(10)
        .pagination(pagination)
        .addField(new Field('id').label('ID'))
        .addField(new Field('name'))
        .addField(new Field('published').label('Is published ?').type('boolean'));

    tag.listView()
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
        .listActions(['show']);

    tag.showView()
        .addField(new Field('name'))
        .addField(new Field('published').type('boolean'));

    NgAdminConfigurationProvider.configure(app);
});
```

## Entity Configuration

Each entity maps to a different API endpoint. The name of the entity, defines the endpoint:

```js
// set the main API endpoint for this admin
var app = new Application('My backend')
    .baseApiUrl('http://localhost:3000/');

// define an entity mapped by the http://localhost:3000/posts endpoint
var post = new Entity('posts');
```

* `label()`
Defines the name of the entity, as displayed on screen

        var comment = new Entity('comments').label('Discussions');

* `readOnly()`
A read-only entity doesn't allow access to the mutation views (editionView, creationView, deletionView). In addition, all links to the editionView are replaced by links to the showView.

        var tag = new Entity('tags').readOnly();
        
* `baseURL()`
Defines the base API endpoint for all views of this entity

        var comment = new Entity('comments').baseURL('http://localhost:3001/');
        
* `url()`
Defines the API endpoint for all views of this entity. It can be a string or a function.

        var comment = new Entity('comments').url(function(view, entityId) {
            return '/comments/' + view.name() + '/' + entityId; // Can be absolute or relative
        });

* `transformParams()`
Allows to overrides all query parameters.

        var comment = new Entity('comments').transformParams(function(params) {
            params._sort = params.sort;
            
            return params;
        });
        
Default parameters to override: `page`, `per_page`, `q`, `_sort`, `_sortDir`.

## View Configuration

### View Types

Each entity has 7 views that you can customize:

- `listView`:
- `creationView`
- `editionView`
- `showView` (unused by default)
- `deletionView`
- `dashboardView`: this is a special view to define a panel in the dashboard (the ng-admin homepage) for an entity.
- `menuView`: another special view to define the appearance of the entity menu in the sidebar

### General View Settings

These settings are available on all views.

* `addField(Field)`
Add a column to a list, or a form control to a form, mapped by a property in the API endpoint result.

* `title(String)`
The title of the view. ng-admin sees it as a template, and compiles it with the view scope. That means you can customize the title of a view using details from the current entry.

        editView.title('Edit item "{{ entry.values.title }}"');

* `description(String)`
A text displayed below the title.

* `actions(String|Array)`
Customize the list of actions for this view. You can pass a list of button names among 'back', 'list', 'show', create', 'edit', 'delete':

        editView.actions(['show', 'list', 'delete']);

Alternately, if you pass a string, it is compiled just like an Angular template, with access to the current `entry` in the scope. This allows to easily add custom actions, or customize the buttons appearance:

    var template = '<show-button entry="entry" entity="entity" size="sm"></show-button>' +
                   '<delete-button entry="entry" entity="entity" size="sm"></delete-button>' +
                   '<my-custom-directive entry="entry"></my-custom-directive>' +
                   '<back-button></back-button>';
    editView.actions(template);

* `extraParams(function|Object)`
Add extras params to each API request.

* `headers(function|Object)`
Add headers to each API request.

* `interceptor(function)`
Used to transform data from the API into an array of element.

* `disable()`
Disable this view. Useful e.g. to hide the panel for one entity in the dashboard, or to disable views that modify data and only let the `listView` enabled

* `url()`
Defines the API endpoint for a view. It can be a string or a function.

        comment.listView().url(function(entityId) {
            return '/comments/id/' + entityId; // Can be absolute or relative
        });

* `transformParams()`
Allows to overrides all query parameters.

        comment.listView().transformParams(function(params) {
            params._sort = params.sort;
            delete params.sort;
            
            return params;
        });

### dashboardView Settings

* `order(Number)`
Define the order of the Dashboard panel for this entity in the dashboard

### menuView Settings

* `icon(String)`
Override the default icon for the Entity in the sidebar menu. You can use any of Bootstrap's Gmyphicons, or any HTML markup that fits your need.

        post.menuView().icon('<span class="glyphicon glyphicon-file"></span>');

* `order(Integer)`
Set the menu position in the sidebar. By default, Entities appear in the order in which they were added to the application.

* `disable()`
Hide the entity from the sidebar.

### listView Settings

* `perPage(Number)`
Define the number of element displayed in a page

* `pagination(function)`
Define the parameters used to paginate the API:

        listView.pagination(function(page, maxPerPage) {
            return {
                begin: (page - 1) * maxPerPage, 
                end: page * maxPerPage
            };
        });

* `filterQuery(function)`
Define the parameters used to query the API:

        listView.filterQuery(function(searchQuery) {
            return { q: searchQuery };
        });

* `filterQuery(function)`
Define parameters used to query the API. See below.

* `infinitePagination(boolean)`
Enable or disable lazy loading.

* `totalItems(function)`
Define a function that return the total of items:

        listView.totalItems(function(response) {
            return response.headers('X-Total-Count');
        });

* `sortParams(function)`
Define parameters used to sort the API:

        listView.sortParams(function(field, dir) {
            return {
                params: { _sort: field, _sortDir: dir },
                headers: {}
            };
        });

* `addQuickFilter(function)`
Add button to set several filter parameters at once.

        listView.addQuickFilter('Published', function () {
            return {
                published: true
            };
        });

    Quickfilters can be customised with `filterParams`:

        listView.filterParams(function (param) {
           if (param) {
               param.abc = '';
           }
           return param;
        });

* `listActions(String|Array)`
Add an action column with action buttons on each line. You can pass a list of button names among 'show', 'edit', and 'delete'.

        listView.listActions(['edit', 'delete']);

Alternately, if you pass a string, it is compiled just like an Angular template, with access to the current `entry` in the scope. This allows to add custom actions on each line:

    var template = '<show-button entry="entry" entity="entity" size="xs"></show-button>'+
                   '<my-custom-directive entry="entry"></my-custom-directive>';
    listView.listActions(template);


## Fields

A field is the representation of a property of an entity. 

### Field Classes

- `Field`: simple field (possible types: number, string, text, boolean, wysiwyg, email, date, choice, choices, template)
- `Reference`: one-to-many association with another entity
- `ReferencedList`: many-to-one association
- `ReferenceMany`: many-to-many association

### General Field Settings

* `type(string ['number'|'string'|'text'|'boolean'|'wysiwyg'|'email'|'date'|'choice'|'choices'|'template'])`
Define the field type. Default type is 'string', so you can omit it.

* `label(string label)`
Define the label of the field. Defaults to the uppercased field name.

* `displayed(boolean)`
Should the field be displayed in the view ? Useful when we need to retrieve data for custom field

* `editable(boolean)`
Define if the field is editable in the edition form. Usefult to display a field without allowing edition (e.g for creation date).

* `order(number|null)`
Define the position of the field in the view.

* `format(string ['yyyy-MM-dd' by default])`
Define the format for `date` type.

* `isDetailLink(boolean)`
Tell if the value is a link in the list view. Default to true for the identifier field, false otherwise. The link points to the edition view, except for read-only entities, where it points to the show view.

* `choices([{value: '', label: ''}, ...])`
Define array of choices for `choice` type. A choice has both a value and a label.

* `map(function)`
Define a custom function to transform the value. It receive the value and the corresponding entry. Works in list, edit views and references.

        myView.addField(new Field('characters')
            .map(function truncate(value, entry) {
                return value + '(' + entry.values.subValue + ')';
            })
        );

    Multiple `map` can be defined for a field:

        myView.addField(new Field('comment')
            .map(stripTags)
            .map(truncate)
        );

* `validation(object)`
Tell how to validate the view
 - `required`: boolean
 - `validator`: function(value){}
 - `minlength`: number
 - `maxlength`: number

* `attributes(object)`
A list of attributes to be added to the corresponding field.

        editView.addField(new Field('title')
            .attributes({ placeholder: 'fill me !'})
        );

* `cssClasses(String|Function)`
A list of CSS classes to be added to the corresponding field. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values.

        editView.addField(new Field('title')
            .cssClasses(function(entry) {
               return entry.values.needsAttention ? 'bg-warning' : '';
            })
        );

* `defaultValue(*)`
Define the default value of the field in the creation form.

* `template(*)`
Define the template to be displayed for fields of type `template` (can be a string or a function).

## Reusable Directives

The `template` field type allows you to use any HTML tag, including custom directives. ng-admin provides ready-to-use directives to easily add interactions to your admin views:

* `<ma-show-button>`
* `<ma-edit-button>`
* `<ma-delete-button>`

Buttons linking to the related view for the given entry.

```js
entity.listView()
   //
   .addField(new Field('actions').type('template').template('<ma-show-button entry="entry" entity="entity" size="xs"></ma-show-button>'));
```

* `<ma-create-button>`
* `<ma-list-button>`

A button linking to the related view for the given entity.

### `listView.listActions()`

The `listActions()` method available on the listView is a shortcut to adding a template field with one of the directives listed above. In practice, calling:

```js
listView.listActions(['edit', 'delete']);
```

Is equivalent to:

```js
var template = '<ma-edit-button entry="entry" entity="entity" size="xs">' +
               '</ma-edit-button>' +
               '<ma-delete-button entry="entry" entity="entity" size="xs">' +
               '</ma-delete-button>';
listView.addField(new Field('actions').type('template').template(template));
```

## Relationships

### Reference

The `Reference` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

        myView.addField(new Reference('post_id')
            .label('Post title')
            .map(truncate) // Allows to truncate values in the select
            .targetEntity(post) // Select a target Entity
            .targetField(new Field('title')) // Select a label Field
        );
        
* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

		// Will call /posts?post_id[]=1&post_id[]=2&post_id%[]=5...
		commentList.addField(new Reference('post_id').singleApiCall(function (postIds) {
          return {
            'post_id[]': postIds
          };
        })

### ReferencedList

The `ReferencedList` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetReferenceField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define an array of fields that will be displayed in the list of the form.

        myEditView.addField(new ReferencedList('comments') // Define a N-1 relationship with the comment entity
            .label('Comments')
            .targetEntity(comment) // Target the comment Entity
            .targetReferenceField('post_id') // Each comment with post_id = post.id (the identifier) will be displayed
            .targetFields([ // Display comment field to display
                new Field('id').label('ID'),
                new Field('body').label('Comment')
            ])
            )
        );

### ReferenceMany

The `ReferenceMany` type also defines `label`, `order`, `map` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(Field)`
Define the field name used to link the referenced entity.

        myView.addField(new ReferenceMany('tags')
           .label('Tags')
           .isEditLink(false)
           .targetEntity(tag) // Targeted entity
           .targetField(new Field('name')) // Label Field to display in the list
        )
        
* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

		// Will call /tags?tag_id[]=1&tag_id[]=2&tag_id%[]=5...
		postList.addField(new ReferenceMany('tags').singleApiCall(function (tagIds) {
          return {
            'tag_id[]': tagIds
          };
        })

## Customizing the API Mapping

REST is not specific enough to know how to handle an API. ng-admin makes some assumptions about how your API is designed. All of these assumptions can be overridden via the configuration file.
 
### Pagination

ng-admin assumes that your API accepts `page` and `per_page` query parameters to paginate lists:

http://your.api.domain/entityName?page=2&per_page=20

You can change it with the `transformParams()` method on the listView, the entity, or the application. For instance, to use `offset` and `limit` instead of `page` and `per_page` across the entire application, use the following code:

```js
app.transformParams(function(params) {
    if (params.page) {
        params.offset = (params.page - 1) * params.per_page;
        params.limit = params.per_page;
        delete params.page;
        delete params.per_page;
    }
});
```

The default number of items per page is `30`. You can customize it with the `perPage()` method of the listView.

For each list view, the API should should return all items as an array at the root of the response.

```
GET /entityName?page=2&per_page=20 HTTP1.1

HTTP/1.1 200 OK
X-Total-Count: 26
Content-Type: application/json
[
  { date: "2014-01-01T00:00:00Z", "name": "foo", "age": 8 },
  { date: "2014-02-01T00:00:00Z", "name": "bar", "age": 12 },
  { date: "2014-03-01T00:00:00Z", "name": "baz", "age": 4 },
  ...
]
```

To know how many items to paginate through, ng-admin retrieves the total count from the `X-Total-Count` header. This can be changed with the `totalItems()` method of the listView.

### Sorting

To sort each list view, ng-admin uses `_sort` & `_sortDir` query parameters.

http://your.api.domain/entityName?_sort=name&_sortDir=ASC

Once again, you can change it with the `transformParams()` method. For instance, to sort by id desc by default:

```js
app.transformParams(function(params) {
    if (params.page) {
        params._sort = params._sort || 'id';
        params._sortDir = params._sortDir || 'DESC';
    }
});
```

### Filtering

All filter fields are added as pure query parameters, based on the field name (the one defined in the constructor). For instance, the following `filterView()` configuration:

```js
myEntity.filterView()
    .addField(new Field('q').label('').attributes({placeholder: Full text}))
    .addField(new Field('tag'))
```

...will lead to API calls formatted like the following:

http://your.api.domain/entityName?q=foo&tag=bar

### Identifier

ng-admin assumes that the identifier name of your entities is `id`.
You can change it with the `identifier()` method of the entity.

### Date

The default date field format is `yyyy-MM-dd`. You can change it with the `format()` method in fields of type `date`.

## Theming

You can override pretty much all the HTML generated by ng-admin, at different levels.

### Stylesheet

Ng-admin CSS is composed of styles from [sb-admin](http://ironsummitmedia.github.io/startbootstrap-sb-admin-2/), on top of [Bootstrap 3](http://getbootstrap.com/). By using your own CSS in addition to the ng-admin CSS, you can customize the look and feel of every displayed component. 

To ease styling, ng-admin adds custom classes for the entities and fields currently displayed, to allow a finer styling. For instance, the datagrid in the list view always uses a class named `ng-admin-entity-[entityName]`. In the datagrid also, each header in the table uses a class named `ng-admin-column-[fieldName]`, which should allow precise sizing of columns. 

Don't hesitate to inspect the generated source to look for the right CSS selector.

### Custom Classes

To ease theming, you can add a custom class to your fields in every view, using the `cssClasses()` method.

```js
myEntity.listView()
    .addField(new Field('title').cssClasses(['foo', 'bar']));
```

`cssClasses()` can optionally accept a function, to return a class depending on the current entry.

```js
myEntity.listView()
    .addField(new Field('title').cssClasses(function(entry) {
        if (entry.values.publishDate >= Date.now()) {
            return 'bg-success';
        }
    }));
```

### Customizing Directives Templates

Using Angular's [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, and the ability to decorate another provider, you can customize the templates of all the directives used by ng-admin. Here is an example of customization of the 'text' input field customization:

```js
var app = angular.module('myApp', ['ng-admin']);

app.config(function(NgAdminConfigurationProvider, ..., $provide) {
        // Override textarea template
        $provide.decorator('maTextFieldDirective', ['$delegate', function ($delegate) {
            // You can modify directly the template
            $delegate[0].template = angular.element($delegate[0].template).addClass('MyClass')[0].outerHTML;

            // or use a templateURL (loaded from a file or a <script type="text/ng-template" id="string.html"></script> tag)
            $delegate[0].template = '';
            $delegate[0].templateUrl = 'string.html';

            return $delegate;
        }]);

        // ...
});
```

### Customizing The View Template For A Given Entity

For a given entity, each of the main views (`list`, `show`, `create`, `edit`, `delete`) can use a custom HTML template instead of the default one. Just pass it to the `template()` function on the view:

```js
var myTemplate = require('text!./path/to/list.html');
var myEntity = new Entity('foo_endpoint');
myEntity.listView().template(myTemplate);
// continue myEntity configuration
// ...
app.addEntity(myEntity);
```

### Customizing The View Templates For The Entire Application

You can use the `app.customTemplate()` method to customize the template of a given view across the entire application (for all entities). This method expects a function argument, which should return the template as a string.

```js
var myTemplate = require('text!./path/to/list.html');
app.customTemplate(function(viewName) {
    if (viewName === 'ListView') {
        return myTemplate;
    }
})
```

## Contributing

Your feedback about the usage of ng-admin in your specific context is valuable, don't hesitate to [open GitHub Issues](https://github.com/marmelab/ng-admin/issues) for any problem or question you may have.

All contributions are welcome. New applications or options should be tested with the `make test` command.

### Install dependencies

Install bower and npm dependencies (for tests) wi calling the `install` target:

```sh
make install
```

### Run the example app

To test your changes, run the example app, which is bundled with a sample REST api, by calling:

```sh
make run
```

Then, connect to `http://localhost:8000/` to browse the admin app.

### Build

Concatenate and minify the app with:

```sh
make build
```

A new `build/ng-admin.min.js` file will be created.

### Tests

ng-admin has unit tests (powered by karma) and end to end tests (powered by protractor). Launch the entire tests suite by calling:

```
make test
```

## License

ng-admin is licensed under the [MIT Licence](LICENSE), courtesy of [marmelab](http://marmelab.com).
