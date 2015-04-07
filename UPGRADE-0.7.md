# Upgrade to 0.7

## Field factory

ng-admin 0.7 breaks compatibility with 0.5 and makes the "factories" configuration API compulsory. If your configuration uses `nga.field()`, it will still work woth 0.7. If it uses `new Field()`, you'll need to follow [the 0.6 upgrade guide](https://github.com/marmelab/ng-admin/blob/b3c7b1afc6a52651df6ba4454d8461620339b4da/UPGRADE-0.6.md).

## Field type

Method `Field.type()` is no longer supported as a setter. Instead, you should specify the second argument from the field factory.

``` diff
- nga.field('created_at').type('date')
+ nga.field('created_at', 'date')
```

## perPage instead of limit

Dashboard view `limit()` method has been deprecated. Please use the `perPage` method instead.

## Internal Routing Pattern Was Changed

You may have noticed the ng-admin used an internal URL scheme looking like the following:

```
#/list/posts/
#/create/posts/
#/edit/posts/12
#/delete/posts/12
```

In 0.7, the internal URL scheme is more natural:

```
#/posts/list
#/posts/create
#/posts/edit/12
#/posts/delete/12
```

If you have set custom directives linking to existing ng-admin internal URLs ("states"), you must update them to use the new syntax.

## menuView() Is Deprecated

Prior to 0.7, you would customize the appearance of an entity in the menu sidebar using `entity.menuView()` methods.

```js
post.menuView()
  .order(1)
  .icon('<span class="glyphicon glyphicon-file"></span>');
```

This `menuView()` is deprecated in 0.7. 

By default, the sidebar menu is still built automatically based on the entities added to the application. But to change the menu, you have to manipulate the main `Menu` instance. `Menu` is a new class, with a simple structure, allowing to setup menus and submenus ("child" menus), independently of entities. For instance, you can customize the title and icon of a single menu using the following syntax:

```js
admin.addEntity(post)
admin.menu().getChildByTitle('Post')
    .title('Posts')
    .icon('<span class="glyphicon glyphicon-file"></span>');
```

However, if the default menu doesn't suit you, it is recommended to build the menu from scratch, as follows:

```js
admin.menu(nga.menu()
  .addChild(nga.menu(post))
  .addChild(nga.menu(comment).title('Comments'))
  .addChild(nga.menu(tag).icon('<span class="glyphicon glyphicon-tags"></span>'))
);
```

Adding menu children by hand is also the only way to determine the menu order.

The `menuView()` syntax will still be supported in this version, but removed in the next one.

## passing literal to View.fields() and using field.order Is Deprecated
Prior to 0.7, you could pass both literal and array to the fields methods which returned a literal. Now the fields method return an array. And passing literal to it is deprecated.
Additionaly, the order method which served to order fields passed in literal form is also deprecated.

The proper way to use fields is now by passing field and or arrays of fields.
```
fields(field1, field2)
fields([field1, field2])
fields(field1, [field2, field3])
```
