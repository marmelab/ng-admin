# Upgrade to 0.9

## All fields have `.template()`

All field types now support the `template()` method, which makes it easy to customize the look and feel of a particular field, withut sacrificing the native features.

For instance, if you want to customize the appearance of a `NumberField` according to its value:

```js
listview.fields([
    nga.field('amount', 'number')
        .format('$0,000.00')
        .template('<span ng-class="{ \'red\': value < 0 }"><ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column></span>')
]);
```

This removes the need for [custom types](doc/Custom-types.md) in a vast majority of cases.

The `template` field type is deprecated and will be removed in future versions.
