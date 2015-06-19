# Upgrade to 0.8

## View and Entity URL customization

Arguments for the anonymous function of the entity url customisation were changed.

``` diff
- nga.entity('comments').url(function(view, entityId) {
-     return '/comments/' + view.name() + '/' + entityId;
+ nga.entity('comments').url(function(entityName, viewType, identifierValue, identifierName) {
+     return '/comments/' + entityName + '_' + viewType + '/' + identifierValue;
```

## Field Identifier

The `Field.identifier(true)` does not exist anymore. Instead, you must specify the identifier in the associated entity.

``` diff
- nga.field('id').identifier(true)
+ entity.identifier(nga.field('id'))
```

## `dashboardView()` is deprecated, use `admin.dashboard()` instead

To let developers customize the admin dashboard at will, ng-admin 0.8 decouples the dashboard data and presentation. You can setup the dashboard datasources and template on a new member of the admin class, `dashboard()`:

```js
admin.dashboard(nga.dashboard()
    .addCollection(name, collection)
    .addCollection(name, collection)
    .addCollection(name, collection)
    .template(templateString)
);
```

This is the preferred way to customize dashboard panel position, title, and to customize the fields displayed in each panel. Configure a collection just like you would like to configure a `listView`. For instance:

```js
admin.dashboard(nga.dashboard()
    .addCollection('posts', nga.collection(post)
        .title('Recent posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
            nga.field('title').isDetailLink(true).map(truncate)
        ])
        .sortField('id')
        .sortOrder('DESC')
        .order(1)
    )
    .addCollection('comments', nga.collection(comment)
        .title('Last comments')
        .perPage(5)
        .fields([
            nga.field('id'),
            nga.field('body', 'wysiwyg').label('Comment').stripTags(true).map(truncate),
            nga.field(null, 'template').label('').template('<post-link entry="entry"></post-link>') // you can use custom directives, too
        ])
        .order(2)
    )
    .addCollection('tags', nga.collection(tag)
        .title('Recent tags')
        .perPage(10)
        .fields([
            nga.field('id'),
            nga.field('name'),
            nga.field('published', 'boolean').label('Is published ?')
        ])
        .order(3)
    )
);
```

See the [Dashboard Configuration](doc/Dashboard.md) dedicated chapter for more details.

Calls to `dashboardView()` are still supported in ng-admin 0.8, but will raise an error in future versions. 
