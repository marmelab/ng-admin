# Upgrade to 0.5

## Filters are now off by default

Up to 0.4, ng-admin included a full-text search input on the list view by default. Now that ng-admin has the ability to define custom filters, the default fullt-text search has been removed.

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
