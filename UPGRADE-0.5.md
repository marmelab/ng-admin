# Upgrade to 0.5

ng-admin v0.5 breaks compatibility with v0.4. You will need to update your configuration to be able to use this new version.

Breaking compatibility allows us to make ng-admin compatible with much more types of REST APIs.

## Query parameters were renamed

The list query parameters were renamed, as follows:

* `page     => _page`
* `per_page => _perPage`
* `_sort    => _sortField`
* `_sortDir => _sortDir` (unchanged)

In addition, filters and quickfilters are not directly appended as query parameters, but as the value of the `_filters` parameter.

That means that all params added by ng-admin are now prefixed by an underscore, and in camelCase.

Here is how a typical HTTP call from ng-admin to a backend API looks like:

http://my.api.backend/posts?_filters=%7B%22created_at%22:%222015-01-13%22%7D&_page=1&_perPage=30&_sortDir=ASC&_sortField=author_id

You can use Restangular's `addFullRequestInterceptor` to transform these into params that your API can understand (see example below).

## HTTP query manipulation methods are removed

To transform parameters on outgoing requests, ng-admin no longer offers any built-in hook. But you have the full power of [Restangular's request interceptors](https://github.com/mgonto/restangular#addrequestinterceptor), which allow you to customize pretty much everything about outgoing requests.
Therefore the following methods are now removed:

* `view.extraParams(function|Object)`
* `view.headers(function|Object)`
* `view.interceptor(function)`
* `listView.pagination()`
* `listView.sortParams()`
* `listView.filterQuery()`
* `listView.filterParams()`
* `listView.totalItems()`

Here is an example of using Restangular built-in capabilities in order to manipulate the request before it is sent:

```js
// replace
var Book = new Entity('books')
Book.listView().pagination(function(page, maxPerPage) {
    return {
        begin: (page - 1) * maxPerPage,
        end: page * maxPerPage
    };
});
// with
RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
    if (operation == 'getList' && what == 'books') {
        params.begin = (params._page - 1) * params._perPage;
        params.end = params._page * params._perPage;
        delete params._page;
        delete params._perPage;
    }
    return { params: params };
});

// replace
Book.listView().sortParams(function(field, dir) {
    return {
        params: { sort: field || 'id', sortDir: dir || 'DESC' },
        headers: {}
    };
});
// with
RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
    if (operation == 'getList' && what == 'books') {
        params.sort = params._sortField || 'id';
        params.sortDir = params._sortDir || 'DESC';
        delete params._sortField;
        delete params._sortDir;
    }
    return { params: params };
});
```

The advantage of request interceptors is that they can run on several entities, or on several verbs.

The same method can be used to add response interceptors.

## Filters are now off by default

Up to 0.4, ng-admin included a full-text search input on the list view by default. Now that ng-admin has the ability to define custom filters, the default full-text search has been removed.

If you need it, it's easy to re-add:

```
myEntity.listView()
    .filters([
        new Field('q').label('').attributes({ placeholder: 'search' })
    ]);
```

The resulting API call will be the same:

```
GET http://myapi.com/my_entity?q=foo
```

## `listView.addQuickFilter()` has been removed

Quick Filters are now filters like others. The same feature can be achieved with classical filters.

```js
// replace
myEntity.listView()
    .addQuickFilter('Today', function () {
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
// with
myEntity.listView()
    .filters([
        new Field('today').type('boolean').map(function() {
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
    ])
```

## `Field.displayed()` has been removed

`Field.displayed()` wasn't used and has been removed.

## Reusable directives are now prefixed with 'ma-'

All directives created by ng-admin have nowe been prefixed with 'ma-'. If you use any of the reusable directives (like `<edit-button>`), you must switch to the prefixed version (like `<ma-edit-button>`).

## Tons of new features

In addition to these changes, ng-admin 0.5 comes with a huge list of new features: Theming, filters, fields reusability, API mapping, Menu icons, JSON field, Error message customization... Check the [changelog](CHANGELOG.md) for a complete list of changes.
