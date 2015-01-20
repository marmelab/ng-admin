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
* [Customizing the API Mapping](doc/API-mapping.md)
* [Theming](doc/Theming.md)
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

Here is a full example for a backend that will let you create, update, and delete some posts (`posts` entity). Those posts can be tagged (`tags` entity) and commented (`comments` entity).

```js

var app = angular.module('myApp', ['ng-admin']);

app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {

    var app = new Application('ng-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // define all entities at the top to allow references between them
    var post = new Entity('posts') // the API endpoint for posts will be http://localhost:3000/posts/:id
        .identifier(new Field('id')); // you can optionally customize the identifier used in the api ('id' by default)

    // set the application entities
    app.addEntity(post);

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

    NgAdminConfigurationProvider.configure(app);
});
```

You can find a more detailed configuration in the [blog demo configuration](examples/blog/config.js).

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

## View Configuration

### View Types

Each entity has 7 views that you can customize:

- `listView`
- `creationView`
- `editionView`
- `showView` (unused by default)
- `deletionView`
- `dashboardView`: another special view to define a panel in the dashboard (the ng-admin homepage) for an entity.
- `menuView`: another special view to define the appearance of the entity menu in the sidebar

### General View Settings

These settings are available on all views.

* `fields([field1, field2, ...])`
Add fields to a view (columns to a list, or a form controls to a form). Each field maps a property in the API endpoint result.

        listView.fields([
            new Field('first_name'),
            new Field('last_name'),
            new Field('age').type('number')
        ]);

* `fields()` Retrieve the list of fields added to a view. The result can be added to another view, to avoid repetition.

* `title(String)`
The title of the view. ng-admin sees it as a template, and compiles it with the view scope. That means you can customize the title of a view using details from the current entry.

        editionView.title('Edit item "{{ entry.values.title }}"');

* `description(String)`
A text displayed below the title.

* `actions(String|Array)`
Customize the list of actions for this view. You can pass a list of button names among 'back', 'list', 'show', create', 'edit', 'delete':

        editionView.actions(['show', 'list', 'delete']);

Alternately, if you pass a string, it is compiled just like an Angular template, with access to the current `entry` in the scope. This allows to easily add custom actions, or customize the buttons appearance:

    var template = '<show-button entry="entry" entity="entity" size="sm"></show-button>' +
                   '<delete-button entry="entry" entity="entity" size="sm"></delete-button>' +
                   '<my-custom-directive entry="entry"></my-custom-directive>' +
                   '<back-button></back-button>';
    editionView.actions(template);

* `disable()`
Disable this view. Useful e.g. to hide the panel for one entity in the dashboard, or to disable views that modify data and only let the `listView` enabled

* `url()`
Defines the API endpoint for a view. It can be a string or a function.

        comment.listView().url(function(entityId) {
            return '/comments/id/' + entityId; // Can be absolute or relative
        });

### dashboardView Settings

The `dashboardView` also defines `sortField` and `sortDir` fields like the `listView`.

* `limit(Number)`
Set the number of items.

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

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `infinitePagination(boolean)`
Enable or disable lazy loading.

* `filters()[field1, field2, ...])`
Add filters to the list. Each field maps a property in the API endpoint result.

        listView.filters([
            new Field('first_name'),
            new Field('last_name'),
            new Field('age').type('number')
        ]);

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

        editionView.addField(new Field('title')
            .attributes({ placeholder: 'fill me !'})
        );

* `cssClasses(String|Function)`
A list of CSS classes to be added to the corresponding field. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values.

        editionView.addField(new Field('title')
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

        myEditionView.addField(new ReferencedList('comments') // Define a N-1 relationship with the comment entity
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

## Contributing

Your feedback about the usage of ng-admin in your specific context is valuable, don't hesitate to [open GitHub Issues](https://github.com/marmelab/ng-admin/issues) for any problem or question you may have.

All contributions are welcome. New applications or options should be tested with the `make test` command.

### Installing Dependencies

Install bower and npm dependencies (for tests) wi calling the `install` target:

```sh
make install
```

### Running the example app

To test your changes, run the example app, which is bundled with a sample REST api, by calling:

```sh
make run
```

Then, connect to `http://localhost:8000/` to browse the admin app.

### Rebuilding the Compiled JS and CSS Files

Concatenate and minify the app with:

```sh
make build-dev
```

The two files `build/ng-admin.min.css` and `build/ng-admin.min.js` will be updated, without minification. Use `make build` instead to build a minified, production-ready version of the two files.

### Testing

ng-admin has unit tests (powered by karma) and end to end tests (powered by protractor). Launch the entire tests suite by calling:

```
make test
```

## License

ng-admin is licensed under the [MIT Licence](LICENSE), courtesy of [marmelab](http://marmelab.com).
