# Customizing the Dashboard

The home page of a ng-admin application is called the Dashboard. Use it to show important pieces of information to the end user, such as latest entries, or charts.

## Default Dashboard

By default, the dashboard page shows one panel per entity, ordered from left to right according to the order in which the entities were added to the application.

Each panel contains a list of latest entries for the entity, based on the fields definition of the `listView` , and limited to 3 fields to avoid screen clutter.

## Dashboard Configuration

If the default Dashboard doesn't suit your needs, create a custom dashboard configuration:

```js
admin.dashboard(nga.dashboard()
    .addCollection(name, collection)
    .addCollection(name, collection)
    .addCollection(name, collection)
);
```

The dashboard configuration defines the dashboard datasources, using named `Collection` definitions. Collection names are useful when you use a custom dashboard template (see below). To create a collection, simply use `nga.collection()`. 

On each collection, you can define the same type of settings as in a `listView`: title, fields, numer of rows (`perPage()`), sorting order (`sortField()` and `sortDir()`). In addition, you can customize the position of the collection in the dashboard using the `order()` function:

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

You can add any number of collections you want, even several collections per entity (e.g. to show most commented posts and posts waiting for publication).

As soon as you define a custom dashboard configuration, it will replace the default dashboard based on all entities and listViews.

If you just need to remove one panel from the default dasboard layout, you have to write a custom dashboard configuration from the ground up.

## Dashboard Template

The default dashboard template iterates over all the collections, and displayes them from left to righ and from top to bottom. If you want to change the size of a particular dashboard panel, or if you want to add panels other than a datagrid, you have to write the dashboard template and set it in the dashboard:

```js
admin.dashboard(nga.dashboard()
    .template(templateString)
);
```

Here is a copy of the default dashboard template, which you can use as a starting point for a custom dashboard template:

```html
<div class="row">
    <div class="col-lg-12">
        <div class="page-header">
            <h1>Dashboard</h1>
        </div>
    </div>
</div>

<div class="row dashboard-content">
    <div class="col-lg-6">
        <div class="panel panel-default" ng-repeat="collection in dashboardController.collections | orderElement" ng-if="$even">
            <ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default" ng-repeat="collection in dashboardController.collections | orderElement" ng-if="$odd">
            <ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]"></ma-dashboard-panel>
        </div>
    </div>
</div>
```

If you decide to use a custom template, you should probably remove the `ng-repeat` and insert the collections one by one, using their names. This way, you can achieve a completely custom layout, and even include custom directives like charts. In that case, don't bother to define `title()` and `order()` in the collection, since you can more easily write them down in the template.

```html
<div class="row dashboard-content">
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.posts" entries="dashboardController.entries[dashboardController.collections.posts.name()]"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.comments" entries="dashboardController.entries[dashboardController.collections.comments.name()]"></ma-dashboard-panel>
        </div>
    </div>
</div>

```

