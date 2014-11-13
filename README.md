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

We chose to define the entities & views directly into a Javascript file to allow greater freedom in the configuration.
For some part of the configuration, you'll be able to directly define the function that matches your specific needs to fit your API.

Here is a full example for a backend that will let you create, update, and delete some posts (`posts` entity).
Those posts can be tagged (`tags` entity) and commented (`comments` entity).

```js
app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList,
                     ReferenceMany, DashboardView, ListView, CreateView, EditView, DeleteView) {

    // Method use to return pagination parameter for the API
    function pagination(page, maxPerPage) {
        return {
            _start: (page - 1) * maxPerPage,
            _end: page * maxPerPage
        };
    }

    // Method use to truncate a value in a list view or a dashboard list
    function truncate(value) {
        if (!value) {
            return '';
        }

        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    // Declare a new entity
    var tag = new Entity('tags')
        .label('Tags')
        .order(3) // Order of this element in the menu
        .identifier(new Field('id')) // Map the identifier field
        .addView(new DashboardView('tag-dashboard') // Add a view for the dashboard
            .label('Recent tags') // title of the view
            .order(3) // Order of the view in the dashboard
            .limit(10) // Limit the number of element displayed in the dashboard
            .pagination(pagination) // Use customer parameter for pagination with a function that takes page & maxPerPage arguments
            .addField(new Field('id').label('ID')) // Add a first field to display
            .addField(new Field('name').label('Name').type('string')) // Field can have multiple type
            .addField(new Field('published').label('Is published ?').type('boolean')) // Like type boolean
            )
        .addView(new ListView('tags-list') // Add a list view
            .title('List of all tags') // Define it's title
            .infinitePagination(false) // Disable lazy loading pagination
            .pagination(pagination) // Use custom parameter for pagination
            .filterQuery(function (query) {
                return {
                    q: query
                };
            })
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
            .addField(new Field('id').label('ID')) // Add a first field
            .addField(new Field('name').label('Name').type('string'))
            .addField(new Field('published').label('Published').type('boolean'))
            .addField(new Field('custom') // Define a custom column with angular template
                .type('callback')
                .label('Upper name')
                .isEditLink(false) // Disable edition link in the column
                .callback(function () { // This template will be displayed in the list using the current scope
                    return '{{ entry.getField("name").value().toUpperCase() }}';
                })
                )
            )
        .addView(new CreateView('tags-create') // This view will be used when creating a new tag
            .addField(new Field('name')
                .label('Name')
                .type('string')
                .validation({ // The name is required with a max length of 150 characters
                    "required": true,
                    "max-length" : 150
                })
                )
            .addField(new Field('published').label('Published').type('boolean'))
            )
        .addView(new EditView('tags_edit')
            .addField(new Field('name').label('Name').type('string').editable(true)) // We can skip validation in edit view
            .addField(new Field('published').label('Published').type('boolean'))
            )
        .addView(new DeleteView('tags-delete') // The delete view does not need any field
            .title('Delete a tag')
            );

    // Add another entity
    var post = new Entity('posts')
        .label('Posts')
        .order(1)
        .identifier(new Field('id'))
        .addView(new DashboardView('post-dashboard')
            .order(1) // First in the dashboard view
            .limit(5)
            .pagination(pagination)
            .label('Recent posts')
            .addField(new Field('title')
                .label('Title')
                .type('string')
                .map(truncate) // Define a customer method that truncate the value in the list view
                )
            )
        .addView(new ListView('post-list')
            .title('All posts')
            // Add extra headers for this list
            .headers(function (entry) {
                return {
                    'X-User': 'user2',
                    'X-Password': 'pwd'
                };
            })
            .sortParams(function (field, dir) {
                return {
                    // Change sorting params
                    params: {
                        _sort: field,
                        _sortDir: dir
                    },
                    // You can also want to sort via headers
                    headers: {
                    }
                };
            })
            .infinitePagination(false)
            .pagination(pagination)
            .addField(new Field('id')
                .label('ID')
                )
            .addField(new Field('title')
                .label('Title')
                )
            .addField(new ReferenceMany('tags') // Define a 1-N relationship with the tag entity
                .label('Tags')
                .isEditLink(false)
                .targetEntity(tag) // Which entity is referenced
                .targetField(new Field('name')) // Define field of this entity to display
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
                .validation({
                    // define your custom validation function
                    validator: function (value) {
                        if (value.indexOf('cat') !== 1) {
                            throw new Error('Tag should contains the word cat');
                        }
                    }
                })
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
            )
        .addView(new DeleteView('post-delete')
            .title('Delete a post')
            );

    var app = new Application('My backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(post)
        .addEntity(tag);

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

### Field

* `name(string)`
Map the Field name with the entity

* `type(string ['number'|'string'|'text'|'boolean'|'wysiwyg'|'email'|'date'|'choice'|'choices'|'callback'])`
Define the field type.

* `label(string label)`
Define the label of the field.

* `displayed(boolean)`
Should the field be displayed in the list view ? Useful when we need to retrieve data for custom field

* `editable(boolean)`
Define if the field is editable in the edition form.

* `order(number|null)`
Define the position of the field in the form.

* `format(string ['yyyy-MM-dd' by default])`
Define the format for `date` type.

* `isEditLink(boolean)`
Tell if the value is a link in the list view

* `choices([{value: '', label: ''}, ...])
Define array of choices for `choice` type. A choice has both a value and a label.

* `valueTransformer(function)`
Define a custom function to transform the value.

```js
.addField(new Field('characters')
    .valueTransformer(function(value) {
        return value && value.items ? value.items[0] : value;
    })
)
```

* `map(function)`
Define a custom function to truncate list values

* `validation(object)`
Tell how to validate the view
 - `required`: boolean
 - `validator`: function(value){}
 - `min-length`: number
 - `max-length`: number
 
* `defaultValue(*)`
Define the default value of the field.

### ListView

You can add quick filters on a list view with :

```js
listView.addQuickFilter('Today', function () {
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
```

Quickfilters can be customised with the `filterParams` of the `ListView`:

```js
lstView.filterParams(function (param) {
   if (param) {
       param.abc = '';
   }

   return param;
})
```

### Reference

The `Reference` type also defines `label`, `order`, `valueTransformer`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

```js
myView.addField(new Reference('post_id')
    .label('Post title')
    .map(truncate) // Allows to truncate values in the select
    .targetEntity(post) // Select a target Entity
    .targetField(new Field('title')) // Select a label Field
)
```

### ReferencedList

The `ReferencedList` type also defines `label`, `order`, `valueTransformer`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetReferenceField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define an array of fields that will be displayed in the list of the form.

```js
myEditView.addField(new ReferencedList('comments') // Define a N-1 relationship with the comment entity
    .label('Comments')
    .targetEntity(comment) // Target the comment Entity
    .targetReferenceField('post_id') // Each comment with post_id = post.id (the identifier) will be displayed
    .targetFields([ // Display comment field to display
        new Field('id').label('ID'),
        new Field('body').label('Comment')
    ])
    )
)
```

### ReferenceMany

The `ReferenceMany` type also defines `label`, `order`, `valueTransformer` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(Field)`
Define the field name used to link the referenced entity.

```js
myView.addField(new ReferenceMany('tags')
   .label('Tags')
   .isEditLink(false)
   .targetEntity(tag) // Targeted entity
   .targetField(new Field('name')) // Label Field to display in the list
)
```

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
