ng-admin
========

Plug me to your RESTFul API to get a complete administration tool (CRUD, multi-model relationships, dashboard, complex form widgets) in no time!

[![http://static.marmelab.com/ng-admin.png](http://static.marmelab.com/ng-admin.png)](http://static.marmelab.com/ng-admin%20demo.mp4)

Check out the [online demo](http://bit.ly/ng-admin-demo2) and the [launch post](http://marmelab.com/blog/2014/09/15/easy-backend-for-your-restful-api.html).

# Installation

- Clone the repository.
- Add a configuration file to describe your entities in `lib/config.js`.
- Run the server with the `grunt` command.
- See the result at [http://localhost:8000/](http://localhost:8000/).

# Configuration

We chose to define the entities directly into a javascript file to allow greater freedom in the configuration.
For some part of the configuration, you'll be able to define directly the function that match you specific needs to fit your API.

Here is a full example for a backend that will allows you to create, update, delete some posts (`posts` entity).
Those posts can be tagged (`tags` entity) and commented (`comments` entity).

```js
define([
    'lib/config/Application',
    'lib/config/Entity',
    'lib/config/Field',
    'lib/config/ReferencedList',
    'lib/config/ReferenceMany'
], function (Application, Entity, Field, ReferencedList, ReferenceMany) {
    "use strict";

    var postBody, postId, postCreatedAt;

    // Declare a new entity
    var tag = Entity('tags')
        .label('Tags')
        // how many element should be displayed in dashboard ?
        .dashboard(10)
        // define your specific pagination function returning GET parameters
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        // enable lazyload pagination
        .infinitePagination(true)
        .filterQuery(function(query) {
            return {
                filter: query
            };
        })
        .addField(Field('id')
            .order(1)
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('name')
            .order(2)
            .label('Name')
            .edition('editable')
            .validation({
                "required": true,
                "max-length" : 150
            })
        );

    var comment = Entity('comments')
        .label('Comments')
        .dashboard(10)
        .infinitePagination(true)
        .filterQuery(false)
        .addField(postId = Field('id')
            .order(1)
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(postBody = Field('body')
            .order(2)
            .label('Comment')
            .edition('editable')
            .validation({
                "required": true,
                "max-length" : 150,
                // define your custom validation function
                "validator" : function(value) {
                    return value.indexOf('cat') > -1;
                }
            })
        )
        .addField(postCreatedAt = Field('created_at')
            .order(3)
            .label('Creation Date')
            .type('date')
            .edition('editable')
            .validation({
                "required": true
            })
        );

    var post = Entity('posts')
        .label('Posts')
        .dashboard(null)
        .pagination(false)
        .addField(Field('id')
            .label('ID')
            .type('number')
            .identifier(true)
            .edition('read-only')
        )
        .addField(Field('body')
            .label('Body')
            .edition('editable')
        )
        .addField(ReferencedList('comments')
            .label('Comments')
            .targetEntity(comment)
            .targetField('post_id')
            .targetFields([postId, postBody])
             )
        .addField(ReferenceMany('tags')
            .label('Tags')
            .targetEntity(tag)
            .targetLabel('name')
        );

    return Application('My backend')
        .baseApiUrl('http://localhost:3000/')
        .addEntity(post)
        .addEntity(comment)
        .addEntity(tag);
});
```

## List of field types

- `Field` : simple field
- `Reference` : association 1-N with another entity
- `ReferenceList` : association N-1
- `ReferenceMany` : association N-N

## List of options for `Field` type

* `type(string ['number'|'text'|'email'|'date'])`
Define the field type.

* `label(string label)`
Define the label of the field.

* `edition(string ['read-only'|'editable'])`
Define if the field is editable in the edition form.

* `order(number|null)`
Define the position of the field in the form.

* `identifier(boolean [true|false])`
Define if this field is the entity's identifier (to build the REST requests).

* `format(string ['yyyy-MM-dd' by default])`
Define the format for `date` type.

* `valueTransformer(function)`
Define a custom function to transform the value.

```js
.addField(Field('characters')
    .valueTransformer(function(value) {
        return value && value.items ? value.items[0] : value;
    })
)
```

* `list(boolean)`
Define if the field should be display in the list.

* `dashboard(number|false)`
Number of elements displayed in dashboard.

* `validation(function)`
Define a custom validation function.


## List of options for `Reference` type

The `Reference` type also defines `label`, `order`, `valueTransformer`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

## List of options for `ReferencedList` type

The `ReferencedList` type also defines `label`, `order`, `valueTransformer`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define an array of fields that will be display in the list of the form.

## List of options for `ReferencedMany` type

The `ReferencedMany` type also defines `label`, `order`, `valueTransformer`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(string)`
Define the field name used to link the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

## Contributing

Your feedback about the usage of ng-admin in your specific context is valuable, don't hesitate to [open GitHub Issues](https://github.com/marmelab/ng-admin/issues) for any problem or question you may have.

All contributions are welcome. New applications or options should be tested  with go unit test tool.

## License

ng-admin is licensed under the [MIT Licence](LICENSE), courtesy of [marmelab](http://marmelab.com).
