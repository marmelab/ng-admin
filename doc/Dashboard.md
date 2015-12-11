# Customizing the Dashboard

The home page of a ng-admin application is called the Dashboard. Use it to show important pieces of information to the end user, such as latest entries, or charts.

## Default Dashboard

By default, the dashboard page shows one panel per entity, ordered from left to right according to the order in which the entities were added to the application.

Each panel contains a list of latest entries for the entity, based on the fields definition of the `listView` , and limited to 3 fields to avoid screen clutter.

## Dashboard Configuration

If the default Dashboard doesn't suit your needs, create a custom dashboard configuration:

```js
admin.dashboard(nga.dashboard()
    .addCollection(collection)
    .addCollection(collection)
    .addCollection(collection)
);
```

The dashboard configuration defines the dashboard datasources, using `Collection` definitions. To create a collection for an entity, simply call `nga.collection(entity)`.

On each collection, you can define the same type of settings as in a `listView`: title, fields, number of rows (`perPage()`), sorting order (`sortField()` and `sortDir()`), and list actions. In addition, you can customize the position of the collection in the dashboard using the `order()` function:

```js
admin.dashboard(nga.dashboard()
    .addCollection(nga.collection(post)
        .name('recent_posts')
        .title('Recent posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
            nga.field('published_at', 'date').label('Published').format('MMM d'),
            nga.field('title').isDetailLink(true).map(truncate),
            nga.field('views', 'number')
        ])
        .sortField('published_at')
        .sortDir('DESC')
        .order(1)
    )
    .addCollection(nga.collection(post)
        .name('popular_posts')
        .title('Popular posts')
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([
            nga.field('published_at', 'date').label('Published').format('MMM d'),
            nga.field('title').isDetailLink(true).map(truncate),
            nga.field('views', 'number')
        ])
        .sortField('views')
        .sortDir('DESC')
        .order(3)
    )
    .addCollection(nga.collection(comment)
        .title('Last comments')
        .perPage(10)
        .fields([
            nga.field('created_at', 'date')
                .label('Posted'),
            nga.field('body', 'wysiwyg')
                .label('Comment')
                .stripTags(true)
                .map(truncate)
                .isDetailLink(true),
            nga.field('post_id', 'reference')
                .label('Post')
                .map(truncate)
                .targetEntity(post)
                .targetField(nga.field('title').map(truncate))
        ])
        .sortField('created_at')
        .sortDir('DESC')
        .order(2)
    )
    .addCollection(nga.collection(tag)
        .title('Tags publication status')
        .perPage(10)
        .fields([
            nga.field('name'),
            nga.field('published', 'boolean').label('Is published ?')
        ])
        .listActions(['show'])
        .order(4)
    )
);
```

You can add any number of collections you want, even several collections per entity (e.g. to show most commented posts and posts waiting for publication).

As soon as you define a custom dashboard configuration, it will replace the default dashboard based on all entities and listViews.

If you just need to remove one panel from the default dashboard layout, you have to write a custom dashboard configuration from the ground up.

## Dashboard Template

The default dashboard template iterates over all the collections, and displays them from left to right and from top to bottom. If you want to change the size of a particular dashboard panel, or if you want to add panels other than a datagrid, you have to write the dashboard template and set it in the dashboard:

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
            <ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default" ng-repeat="collection in dashboardController.collections | orderElement" ng-if="$odd">
            <ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
```

If you decide to use a custom template, you should probably remove the `ng-repeat` directive, and insert the collections one by one, using their names. This way, you can achieve a completely custom layout, and even include custom directives like charts. In that case, don't bother to define `title()` and `order()` in the collection, since you can more easily write them down in the template.

For instance, here is how you can setup a dashboard with a full-width panel for comments, followed by half-width panels for posts and tags:

```html
<div class="row dashboard-content">
    <div class="col-lg-12">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.comments" entries="dashboardController.entries.comments"></ma-dashboard-panel>
        </div>
    </div>
</div>
<div class="row dashboard-content">
    <div class="col-lg-6">
        <div class="panel panel-green">
            <ma-dashboard-panel collection="dashboardController.collections.recent_posts" entries="dashboardController.entries.recent_posts" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
        <div class="panel panel-green">
            <ma-dashboard-panel collection="dashboardController.collections.popular_posts" entries="dashboardController.entries.popular_posts" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-yellow">
            <ma-dashboard-panel collection="dashboardController.collections.tags" entries="dashboardController.entries.tags" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
```

*Tip*: Collections are named after their entity. If you defined more than one collection for a given entity, override the collection name using `collection.name(customName)` in the configuration, so that you can refer to that collection name in the template.
