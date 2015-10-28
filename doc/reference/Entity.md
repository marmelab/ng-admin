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

* `readOnly()`
A read-only entity doesn't allow access to the mutation views (editionView, creationView, deletionView). In addition, all links to the editionView are replaced by links to the showView.

        var tag = nga.entity('tags').readOnly();

* `baseApiUrl()`
Defines the base API endpoint for all views of this entity

        var comment = nga.entity('comments').baseApiUrl('http://localhost:3001/');

* `url()`
Defines the API endpoint for all views of this entity. It can be a string or a function.

        var comment = nga.entity('comments').url(function(entityName, viewType, identifierValue, identifierName) {
            return '/comments/' + entityName + '_' + viewType + '?' + identifierName + '=' + identifierValue; // Can be absolute or relative
        });

* `createMethod(string)` and `updateMethod(string)`
Customize the HTTP method to be used for write queries, e.g. to use `PATCH` instead of `PUT`.

* `listView()`, `creationView()`, `editionView()`, `showView()`, and `deletionView()` are getters for the entity's [Views](View.md). 