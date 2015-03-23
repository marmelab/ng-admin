ng-admin [![Build Status](https://travis-ci.org/marmelab/ng-admin.png?branch=master)](https://travis-ci.org/marmelab/ng-admin)
========

[![Join the chat at https://gitter.im/marmelab/ng-admin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/marmelab/ng-admin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Plug me to your RESTFul API to get a complete administration tool (CRUD, multi-model relationships, dashboard, complex form widgets) in no time!

[![Screencast](http://marmelab.com/ng-admin/images/screencast.png)](https://vimeo.com/118697682)

Check out the [online demo](http://ng-admin.marmelab.com/) ([source](https://github.com/marmelab/ng-admin-demo)), and the [launch post](http://marmelab.com/blog/2014/09/15/easy-backend-for-your-restful-api.html).

* [Installation](#installation)
* [Example Configuration](#example-configuration)
* [Entity Configuration](#entity-configuration)
* [View Configuration](#view-configuration)
* [Reusable Directives](#reusable-directives)
* [Relationships](#relationships)
* [Customizing the API Mapping](doc/API-mapping.md)
* [Theming](doc/Theming.md)
* [Adding Custom Pages](doc/Custom-pages.md)
* [Adding Custom Types](doc/Custom-types.md)
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
app.config(function (AdminDescription, NgAdminProvider) {
    var nga = AdminDescription;
    // set the main API endpoint for this admin
    var app = nga.application('My backend')
        .baseApiUrl('http://localhost:3000/');

    // define an entity mapped by the http://localhost:3000/posts endpoint
    var post = nga.entity('posts');
    app.addEntity(post);

    // set the list of fields to map in each post view
    post.dashboardView().fields(/* see example below */);
    post.listView().fields(/* see example below */);
    post.creationView().fields(/* see example below */);
    post.editionView().fields(/* see example below */);

    NgAdminProvider.configure(app);
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

app.config(function (NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;
    var app = nga.application('ng-admin backend demo') // application main title
        .baseApiUrl('http://localhost:3000/'); // main API endpoint

    // define all entities at the top to allow references between them
    var post = nga.entity('posts') // the API endpoint for posts will be http://localhost:3000/posts/:id
        .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

    // set the application entities
    app.addEntity(post);

    // customize entities and views

    post.menuView()
        .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

    post.dashboardView() // customize the dashboard panel for this entity
        .title('Recent posts')
        .order(1) // display the post panel first in the dashboard
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([nga.field('title').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

    post.listView()
        .title('All posts') // default title is "[Entity_name] list"
        .description('List of posts with infinite pagination') // description appears under the title
        .infinitePagination(true) // load pages as the user scrolls
        .fields([
            nga.field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
            nga.field('title'), // the default list field type is "string", and displays as a string
            nga.field('published_at', 'date'), // Date field type allows date formatting
            nga.field('views', 'number'),
            nga.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
                .targetEntity(tag) // the tag entity is defined later in this file
                .targetField(nga.field('name')) // the field to be displayed in this list
        ])
        .listActions(['show', 'edit', 'delete']);

    post.creationView()
        .fields([
            nga.field('title') // the default edit field type is "string", and displays as a text input
                .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
                .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
            nga.field('teaser', 'text'), // text field type translates to a textarea
            nga.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
            nga.field('published_at', 'date') // Date field type translates to a datepicker
        ]);

    post.editionView()
        .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
        .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
        .fields([
            post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
            nga.field('tags', 'reference_many') // reference_many translates to a select multiple
                .targetEntity(tag)
                .targetField(nga.field('name'))
                .cssClasses('col-sm-4'), // customize look and feel through CSS classes
            nga.field('views', 'number')
                .cssClasses('col-sm-4'),
            nga.field('comments', 'referenced_list') // display list of related comments
                .targetEntity(comment)
                .targetReferenceField('post_id')
                .targetFields([
                    nga.field('id'),
                    nga.field('body').label('Comment')
                ])
        ]);

    post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
        .fields([
            nga.field('id'),
            post.editionView().fields(), // reuse fields from another view in another order
            nga.field('custom_action', 'template')
                .template('<other-page-link></other-link-link>')
        ]);

    nga.configure(app);
});
```

You can find a more detailed configuration in the [blog demo configuration](examples/blog/config.js).

## Entity Configuration

Each entity maps to a different API endpoint. The name of the entity, defines the endpoint:

```js
// set the main API endpoint for this admin
var app = nga.application('My backend')
    .baseApiUrl('http://localhost:3000/');

// define an entity mapped by the http://localhost:3000/posts endpoint
var post = nga.entity('posts');
```

* `label()`
Defines the name of the entity, as displayed on screen

        var comment = nga.entity('comments').label('Discussions');

* `readOnly()`
A read-only entity doesn't allow access to the mutation views (editionView, creationView, deletionView). In addition, all links to the editionView are replaced by links to the showView.

        var tag = nga.entity('tags').readOnly();
        
* `baseURL()`
Defines the base API endpoint for all views of this entity

        var comment = nga.entity('comments').baseURL('http://localhost:3001/');
        
* `url()`
Defines the API endpoint for all views of this entity. It can be a string or a function.

        var comment = nga.entity('comments').url(function(view, entityId) {
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
            nga.field('first_name'),
            nga.field('last_name'),
            nga.field('age', 'number')
        ]);

* `fields()` Retrieve the list of fields added to a view. The result can be added to another view, to avoid repetition.

* `title(String)`
The title of the view. ng-admin sees it as a template, and compiles it with the view scope. That means you can customize the title of a view using details from the current entry.

        editionView.title('Edit item "{{ entry.values.title }}"');

* `description(String)`
A text displayed below the title. Like the `title` ng-admin sees it as a template and it can be customized in the same way.

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

* `perPage(Number)`
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
            nga.field('first_name'),
            nga.field('last_name'),
            nga.field('age', 'number')
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

### General Field Settings

* `nga.field(name, type)`
Create a new field of the given type. Default type is 'string', so you can omit it. Bundled types include `number`, `string`, `text`, `boolean`, `wysiwyg`, `email`, `date`, `datetime`,  `choice`, `choices`, `json`, `file`, and `template`

* `label(string label)`
Define the label of the field. Defaults to the uppercased field name.

* `editable(boolean)`
Define if the field is editable in the edition form. Usefult to display a field without allowing edition (e.g for creation date).

* `order(number|null)`
Define the position of the field in the view.

* `isDetailLink(boolean)`
Tell if the value is a link in the list view. Default to true for the identifier and references field, false otherwise. The link points to the edition view, except for read-only entities, where it points to the show view.

* `detailLinkRoute(string)`
Define the route for a link in the list view, i.e. `isDetailLink` of the field is true. The default is `edit`, hence the link points to the edition view. The other option is `show` to point to the show view.

* `map(function)`
Define a custom function to transform the value. It receive the value and the corresponding entry. Works in list, edit views and references.

        nga.field('characters')
            .map(function truncate(value, entry) {
                return value + '(' + entry.values.subValue + ')';
            });

    Multiple `map` can be defined for a field:

        nga.field('comment')
            .map(stripTags)
            .map(truncate);

* `validation(object)`
Tell how to validate the view
 - `required`: boolean
 - `validator`: function(value){}
 - `minlength`: number
 - `maxlength`: number

* `attributes(object)`
A list of attributes to be added to the corresponding field.

        nga.field('title').attributes({ placeholder: 'fill me !'})

* `cssClasses(String|Function)`
A list of CSS classes to be added to the corresponding field. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values.

        nga.field('title')
            .cssClasses(function(entry) {
                return entry.values.needsAttention ? 'bg-warning' : '';
            });

* `defaultValue(*)`
Define the default value of the field in the creation form.

### `number` Field Settings

* `format(string)`
Format for number to string conversion. Based on [Numeral.js](http://numeraljs.com/), which uses a syntax similar to Excel. You can configure the locale and create named formats by following [angular-numeraljs](https://github.com/baumandm/angular-numeraljs) instructions.

        nga.field('cost', 'number').format('$0,0.00');
        // now 1234.5 will render as '$1,234.50'

### `choice` and `choices` Field Settings

* `choices([{value: '', label: ''}, ...])`
Define array of choices for `choice` type. A choice has both a value and a label.

### `date` Field Settings

* `format(string ['yyyy-MM-dd' by default])`

* `parse(function [remove hours, minutes and timezone by default])`
Filter applied to modify date object returned by date picker if needed.

### `datetime` Field Settings

* `format(string ['yyyy-MM-dd HH:mm:ss' by default])`

* `parse(function [no change by default])`
Filter applied to modify date object returned by date picker if needed.

### `template` Field Settings

* `template(*)`
Define the template to be displayed for fields of type `template` (can be a string or a function).

### `file` Field Settings

* `uploadInformation`
Give upload information for `file` field type
 - `url`: url for server side upload
 - `accept`: values allowed by the standard HTML file input accept attribute
 - `apifilename`: filename assigned by the server and returned by your API. 
 
If the uploaded file is renamed server-side, you can get the new filename from an api return.    

    HTTP/1.1 200 OK
    Content-Type: application/json
    { "picture_name": "post_12_picture1.jpg"}

you can configure file field as :

    nga.field('picture', 'file').uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

Some other properties are allowed, see https://github.com/danialfarid/angular-file-upload#upload-service for the complete list.

### `wysiwyg` Field Settings

* `stripTags(boolean)`
Enable removal of all HTML tags - only the text is kept. Useful for displaying rich text in a table, or before truncation. False by default. 

* `sanitize(boolean)`
Enable HTML sanitization of WYSIWYG Editor value (removal of script tags, etc). True by default.

## Reusable Directives

The `template` field type allows you to use any HTML tag, including custom directives. ng-admin provides ready-to-use directives to easily add interactions to your admin views:

* `<ma-show-button>`
* `<ma-edit-button>`
* `<ma-delete-button>`

Buttons linking to the related view for the given entry.

```js
entity.listView().fields([
    // ...
    nga.field('actions', 'template').template('<ma-show-button entry="entry" entity="entity" size="xs"></ma-show-button>')
]);
```

* `<ma-create-button>`
* `<ma-list-button>`

A button linking to the related view for the given entity.

* `<ma-filtered-list-button>`

A button linking to an entity list view, prefiltered.

```js
entity.listView().fields([
    // ...
    nga.field('', 'template').label('')
        template('<ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }" size="sm">')
]);
```

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
listView.fields([
    nga.field('actions', 'template').template(template)
]);
```

## Relationships

### `reference` Field

The `reference` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

        myView.fields([
            nga.field('post_id', 'reference')
                .label('Post title')
                .map(truncate) // Allows to truncate values in the select
                .targetEntity(post) // Select a target Entity
                .targetField(nga.field('title')) // Select a label Field
        ]);
        
* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

		// Will call /posts?post_id[]=1&post_id[]=2&post_id%[]=5...
		commentList.fields([
            nga.field('post_id', 'reference')
                .singleApiCall(function (postIds) {
                    return { 'post_id[]': postIds };
                })
        ]);

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `filters({ field1: value, field2: value, ...])`
Add filters to the referenced results list.

* `perPage(integer)`
Define the maximum number of elements fetched and displayed in the list.

### `referenced_list` Field

The `referenced_list` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetReferenceField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define an array of fields that will be displayed in the list of the form.

        myEditionView.fields([
            nga.field('comments', 'referenced_list') // Define a N-1 relationship with the comment entity
                .label('Comments')
                .targetEntity(comment) // Target the comment Entity
                .targetReferenceField('post_id') // Each comment with post_id = post.id (the identifier) will be displayed
                .targetFields([ // Display comment field to display
                    nga.field('id').label('ID'),
                    nga.field('body').label('Comment')
                ])
        ]);

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `filters({ field1: value, field2: value, ...])`
Add filters to the referenced results list.

* `perPage(integer)`
Define the maximum number of elements fetched and displayed in the list.

### `reference_many` Field

The `reference_many` field type also defines `label`, `order`, `map` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(Field)`
Define the field name used to link the referenced entity.

        myView.fields([
            nga.field('tags', 'reference_many')
               .label('Tags')
               .isDetailLink(false)
               .targetEntity(tag) // Targeted entity
               .targetField(nga.field('name')) // Label Field to display in the list
        ])
        
* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

		// Will call /tags?tag_id[]=1&tag_id[]=2&tag_id%[]=5...
		postList.fields([
            nga.field('tags', 'reference_many')
                .singleApiCall(function (tagIds) {
                    return { 'tag_id[]': tagIds };
                })
        ]);

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
