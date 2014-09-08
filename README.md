ng-admin
========

Plug me to your RESTFul API to get a complete administration tool in no time!

# Installation

- Clone the repository.
- Add a configuration file to describe your entities in `lib/config.js`.
- Run the server with the `grunt` command.
- See the result at [http://localhost:8000/](http://localhost:8000/)

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
        // display in dashboard ?
        .dashboard(10)
        // define your specific pagination function
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        // lazyload pagination
        .infinitePagination(true)
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
        .pagination(function(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: (page) * maxPerPage
            };
        })
        .infinitePagination(true)
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
                    return value.indexOf('chat') > -1;
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

- Field : simple field
- Reference : association 1-N with another entity
- ReferenceList : association N-1
- ReferenceMany : association N-N

## List of field options

* label(string label)
Define the label of the field.

* type(string ['number'|'text'|'email'|'date'])
Define the field type.

* identifier(boolean [true|false])
Define if this field is the entity's identifier (to build the REST requests).

* edition(string ['read-only'|'editable'])
Define if the field is editable in the edition form.

* dashboard(int number)
Number of elements displayed in dashboard.

