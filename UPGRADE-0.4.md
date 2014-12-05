# Upgrade to 0.4

0.4 adds many new features, and deprecates a few APIs. The 0.3 syntax is still supported, but will log a warning urging you to upgrade before we remove these calls in 0.5

## New Features : see announcement blog post

We've described what's new in a [blog post](http://marmelab.com/blog/2014/12/05/ngadmin-04-eating-our-own-dog-food.html), make sure you read it to use the latest features.

Check the [example configuration](src/javascripts/config-dist.js) for an overview of the updated syntax.

## Deprecated: `Entity.addView()`

All views are now added by default. Access a view using one of the view names, and add fields to if the old way.

```js
// ng-admin 0.3 style
entity.addView(new EditView()
  .addField(...)
  .addField(...)
);
// replace by the following in 0.4
entity.editionView()
  .addField(...)
  .addField(...);
```

The available view names are:
* `dashboardView()`
* `listView()`
* `showView()`
* `creationView()`
* `editionView()`
* `deletionView()`

## Deprecated: `Field.isEditLink()`

Since a field can be a link to the Edit view or the Show view (for read-only entities), we've renamed `isEditLink()` to `isDetailLink()`:

```js
entity.addField(new Field('title').isDetailLink(true));
```

## Deprecated: `Entity.addMappedField()`

A call to `Entity.addMappedField()` was necessary when you referenced a fied in a template that was not directly mapped as a field name. This is not necessary anymore.

```js
entity.addField(new Field('custom')
    .label('Contents')
    .type('template')
    .template('{{ entry.values.body | trim }}')
);
// no need to declare `body` as a mapped field.
```
