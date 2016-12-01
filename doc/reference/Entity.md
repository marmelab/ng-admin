# Entity Configuration

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

* `identifier(Field)`
Defines the field to be used as identifier. By default, entities use the field named `id`.

        var post = nga.entity('posts').identifier(nga.field('_id'));

* `readOnly()`
A read-only entity doesn't allow access to the mutation views (editionView, creationView, deletionView). In addition, all links to the editionView are replaced by links to the showView.

        var tag = nga.entity('tags').readOnly();

* `singleton()`
A signleton entity represents a single instance that can be edited, but not created or destroyed. Enabling this removes access to listView, creationView and deletionView, while editionView and showView become accessible at /:entity rather than /:entity/:id.

        var settings = nga.entity('settings').singleton();

* `baseApiUrl()`
Defines the base API endpoint for all views of this entity

        var comment = nga.entity('comments').baseApiUrl('http://localhost:3001/');

* `url()`
Defines the API endpoint for all views of this entity. It can be a string or a function.

        var comment = nga.entity('comments').url(function(entityName, viewType, identifierValue, identifierName) {
            var e = encodeURIComponent;
            return '/comments/' + e(entityName) + '_' + e(viewType) + '?' + e(identifierName) + '=' + e(identifierValue); // Can be absolute or relative
        });

* `createMethod(string)` and `updateMethod(string)`
Customize the HTTP method to be used for write queries, e.g. to use `PATCH` instead of `PUT`.

* `listView()`, `creationView()`, `editionView()`, `showView()`, and `deletionView()` are getters for the entity's [Views](View.md). Most of an entity's customization takes place in the views. See the [Views Configuration](View.md) chapter for details.

        var post = nga.entity('post');
        post.listView()
            .fields([
                nga.field('id'),
                nga.field('title'),
                nga.field('userId', 'reference')
                    .targetEntity(user)
                    .targetField(nga.field('username'))
                    .label('User')
            ]).filters([
                nga.field('q')
                    .label('Full-Text')
                    .pinned(true),
                nga.field('userId', 'reference')
                    .targetEntity(user)
                    .targetField(nga.field('username'))
                    .label('User')
            ]);
