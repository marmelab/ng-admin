ng-admin [![Build Status](https://travis-ci.org/marmelab/ng-admin.png?branch=master)](https://travis-ci.org/marmelab/ng-admin)
========

Plug me to your RESTFul API to get a complete administration tool (CRUD, multi-model relationships, dashboard, complex form widgets) in no time!

[![http://static.marmelab.com/ng-admin.png](http://static.marmelab.com/ng-admin.png)](http://static.marmelab.com/ng-admin%20demo.mp4)

Check out the [online demo](http://ng-admin.marmelab.com/) ([source](https://github.com/marmelab/ng-admin-demo)), and the [launch post](http://marmelab.com/blog/2014/09/15/easy-backend-for-your-restful-api.html).

# Installation

Retrieve the module from bower:

```sh
bower install ng-admin --save
```

Include it:

```html
<link rel="stylesheet" href="/path/to/bower_components/ng-admin/build/ng-admin.min.css">

<script src="/path/to/bower_components/ng-admin/build/ng-admin.min.js" type="text/javascript"></script>
```

Make your application depend on it:
```js
var app = angular.module('myApp', ['ng-admin']);
```

Configure ng-admin:
```js
app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList,
                         ReferenceMany, DashboardView, ListView, CreateView, EditView, DeleteView) {
    // See below for more information about the configuration

    var app = new Application('My backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(/* ... */)
            .addView(new DashboardView('dashboard').addField(/**/))
            .addView(new ListView('post-list').addField(/**/))
            .addView(new CreateView('post-create').addField(/**/))
            .addView(new EditView('post-update').addField(/**/))
            .addView(new DeleteView('post-delete'));
        /* ... */

    NgAdminConfigurationProvider.configure(app);
});
```

Your application should use a `ui-view`:
```html
<div ui-view></div>
```

# Configuration

We chose to define the entities & views directly in JavaScript to allow greater freedom in the configuration.

Here is a full example for a backend that will let you create, update, and delete some posts (`posts` entity).
Those posts can be tagged (`tags` entity) and commented (`comments` entity).

```js

var app = angular.module('myApp', ['ng-admin']);

app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList,
                     ReferenceMany, DashboardView, ListView, CreateView, EditView, DeleteView) {

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

    function truncate(value) {
        if (!value) return '';
        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    function pagination(page, maxPerPage) {
        return { _start: (page - 1) * maxPerPage, _end: page * maxPerPage }; // how the pagination should be reflected as API query params
    }

    // customize entities and views
    post
        .order(1) // post should be the first item in the sidebar menu
        .addView(new DashboardView('post-dashboard') // initialize a view with a name to ease routing
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            .pagination(pagination) // use the custom pagination function to format the API request correctly
            .label('Recent posts')
            .addField(new Field('title').map(truncate))
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

```

## View types

- `DashboardView`: display a block in the dashboard
- `ListView`: main list view
- `CreateView`: creation form
- `EditView`: edition form
- `DeleteView`: deletion view

## Field types

- `Field`: simple field
- `Reference`: association 1-N with another entity
- `ReferencedList`: association N-1
- `ReferenceMany`: association N-N

## General Field Parameters

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

* `isEditLink(boolean)`
Tell if the value is a link in the list view. Default to true for the identifier field, false otherwise.

* `choices([{value: '', label: ''}, ...])
Define array of choices for `choice` type. A choice has both a value and a label.

* `map(function)`
Define a custom function to transform the value. Works in list and edit views.

        myView.addField(new Field('characters')
            .map(function truncate(value) {
                return value.length > 50 ? value.substr(0, 50) + '...' : value;
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
 - `min-length`: number
 - `max-length`: number
 
* `defaultValue(*)`
Define the default value of the field in the creation form.

* `template(*)`
Define the template to be displayed (can be a string or a function).

## General Field Parameters

* `title(String)`
The title of the view.

* `description(String)`
A text displayed below the title.

* `extraParams(function|Object)`
Add extras params to each API request.

* `headers(function|Object)`
Add headers to each API request.

* `interceptor(function)`
Used to transform data from the API into an array of element.

## DashboardView Customization

* `order(Number)`
Defines the order Dashboard panel in the dashboard

## ListView Customization

* `perPage(Number)`
Defines the number of element displayed in a page

* `pagination(function)`
Defines parameters used to paginate the API:

        myView.pagination(function(page, maxPerPage) {
            return {
                begin: (page - 1) * maxPerPage, 
                end: page * maxPerPage
            };
        });

* `filterQuery(function)`
Defines parameters used to query the API:

        myView.filterQuery(function(q) {
            return { query: q };
	    });

* `filterQuery(function)`
Defines parameters used to query the API. See below.

* `infinitePagination(boolean)`
Enable or disable lazy loading.

* `totalItems(function)`
Define a function that return the total of items:

        myView.totalItems(function(response) {
            return response.headers('X-Total-Count');
        });

* `sortParams(function)`
Defines parameters used to sort the API:

	    myView.sortParams(function(field, dir) {
            return {
                params: { _sort: field, _sortDir: dir },
                headers: {}
            };
        });

    You can add quick filters on a list view with:

        myView.addQuickFilter('Today', function () {
            var now = new Date(),
	            year = now.getFullYear(),
	            month = now.getMonth() + 1,
	            day = now.getDate();
        
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
        
            return {
                created_at: [year, month, day].join('-')
            };
        });

    Quickfilters can be customised with the `filterParams` of the `ListView`:

        myView.filterParams(function (param) {
           if (param) {
               param.abc = '';
           }
           return param;
        });

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

## Build

Concatenate and minify the app with:

```sh
grunt build
```

## Tests

Tests are launched with karma by grunt:

```
grunt test
```

A new `build/ng-admin.min.js` file will be created.

## Contributing

Your feedback about the usage of ng-admin in your specific context is valuable, don't hesitate to [open GitHub Issues](https://github.com/marmelab/ng-admin/issues) for any problem or question you may have.

All contributions are welcome. New applications or options should be tested with `make test` command.

## License

ng-admin is licensed under the [MIT Licence](LICENSE), courtesy of [marmelab](http://marmelab.com).
