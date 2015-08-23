# Reusable Directives

The `template` field type allows you to use any HTML tag, including custom directives. ng-admin provides ready-to-use directives to easily add interactions to your admin views:

* `<ma-show-button>`
* `<ma-edit-button>`
* `<ma-delete-button>`

Buttons linking to the related view for the given entry.

```js
entity.listView().fields([
    // ...
    nga.field('actions', 'template').template('<ma-show-button entry="entry" entity="entity" size="xs"></ma-show-button>')
]);
```

* `<ma-create-button>`
* `<ma-list-button>`

A button linking to the related view for the given entity.

* `<ma-filtered-list-button>`

A button linking to an entity list view, prefiltered.

```js
entity.listView().fields([
    // ...
    nga.field('', 'template').label('')
        template('<ma-filtered-list-button entity-name="comments" filter="{ post_id: entry.values.id }" size="sm">')
]);
```

## `listView.listActions()`

The `listActions()` method available on the listView is a shortcut to adding a template field with one of the directives listed above. In practice, calling:

```js
listView.listActions(['edit', 'delete']);
```

Is equivalent to:

```js
var template = '<ma-edit-button entry="entry" entity="entity" size="xs">' +
               '</ma-edit-button>' +
               '<ma-delete-button entry="entry" entity="entity" size="xs">' +
               '</ma-delete-button>';
listView.fields([
    nga.field('actions', 'template').template(template)
]);
```

You can also provide custom label using the `label` attribute:

```js
listView.listActions([
    '<ma-edit-button entry="entry" entity="entity" label="Edit me" size="xs">' +
    '</ma-edit-button>',
    '<ma-delete-button entry="entry" entity="entity" label="Delete me" size="xs">' +
    '</ma-delete-button>'
]);
```

