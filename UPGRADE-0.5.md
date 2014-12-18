# Upgrade to 0.5

## Filters are now off by default

Up to 0.4, ng-admin included a full-text search input on the list view by default. Now that ng-admin has the ability to define custom filters, the default fullt-text search has been removed.

If you need it, it's easy to re-add:

```
myEntity.filterView()
    .addField(new Field('q').label('').attributes({ placegolder: 'search' }));
```

The resulting API call will be the same:

```
GET http://myapi.com/my_entity?q=foo
```
