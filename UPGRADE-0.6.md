# Upgrade to 0.5

## Factories

The configuration API doesn't allow direct instanciation of entity or fields via `new` anymore. Instead, you have to use the factory functions provided by `NgAdminConfigurationProvider`:

```js
// replace
app.config(function (NgAdminConfigurationProvider, Application, Entity, Field) {
    var admin = new Application('my admin');
    var post = new Entity('posts');
    post.listView().fields([
        new Field('title'),
        new Field('published_at').type('date'),
        new Field('body').type('wysiwyg')
    ]);
}

// by
app.config(function (NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;
    var admin = nga.application('my admin');
    var post = nga.entity('posts');
    post.listView().fields([
        nga.field('title'),
        nga.field('published_at', 'date'),
        nga.field('body', 'wysiwyg')
    ]);
}
```

`nga.field()` takes two parameters (name and type); calling `.type()` on an existing field isn't supported anymore.

And references are fields, too. Instead of `new Reference()`, `new ReferenceMany()`, and `new ReferencedList()`, use `nga.field(name, type)` with the type `reference`, `reference_many`, and `referenced_list`:

```js
// replace
post.listView().fields([
    new ReferenceMany('tags')
        .targetEntity(tag) // the tag entity is defined later in this file
        .targetField(nga.field('name'))
]);
comment.listView().fields([
    new Reference('post_id')
        .label('Post')
        .targetEntity(post)
        .targetField(nga.field('title').map(truncate))
])

// by
post.listView().fields([
    nga.field('tags', 'reference_many')
        .targetEntity(tag) // the tag entity is defined later in this file
        .targetField(nga.field('name'))
]);
comment.listView().fields([
    nga.field('post_id', 'reference')
        .label('Post')
        .targetEntity(post)
        .targetField(nga.field('title').map(truncate))
])
```
