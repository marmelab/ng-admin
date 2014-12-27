# Upgrade to 0.5

## `listView.pagination()` and `listView.sortParams()` are deprecated

A new method is available on all views (and can even be set at the application and entity level). It's called `transformParams()`. I supersedes and deprecates `pagination()` and `sortParams()`.

```js
// replace
myEntity.listView().pagination(function(page, maxPerPage) {
    return {
        begin: (page - 1) * maxPerPage,
        end: page * maxPerPage
    };
});
// with
myEntity.listView().transformParams(function(params) {
    params.begin = (params.page - 1) * params.per_page;
    params.end = params.page * params.per_page;
    delete params.page;
    delete params.per_page;
});

// replace
myEntity.listView().sortParams(function(field, dir) {
    return {
        params: { sort: field || 'id', sortDir: dir || 'DESC' },
        headers: {}
    };
});
// with
myEntity.listView().transformParams(function(params) {
    params.sort = params._sort || 'id';
    params.sortDir = params._sortDir || 'DESC';
    delete params.page;
    delete params.per_page;
});
```

## Filters are now off by default

Up to 0.4, ng-admin included a full-text search input on the list view by default. Now that ng-admin has the ability to define custom filters, the default full-text search has been removed.

If you need it, it's easy to re-add:

```
myEntity.filterView()
    .addField(new Field('q').label('').attributes({ placeholder: 'search' }));
```

The resulting API call will be the same:

```
GET http://myapi.com/my_entity?q=foo
```

## Reusable directives are now prefixed with 'ma-'

All directives created by ng-admin have nowe been prefixed with 'ma-'. If you use any of the reusable directives (like `<edit-button>`), you must switch to the prefixed version (like `<ma-edit-button>`).
