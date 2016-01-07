# Menu Configuration

By default, ng-admin creates a sidebar menu with one entry per entity. If you want to customize this sidebar (labels, icons, order, adding submenus, etc), you have to define menus manually.

The sidebar menu is built based on a `Menu` object, constructed with `nga.menu()`. A menu can have child menus. A menu can be constructed based on an entity. Here is the code to create a basic menu for the entities `post`, `comment`, `tag`, and `settings`:

```js
admin.menu(nga.menu()
  .addChild(nga.menu(post))
  .addChild(nga.menu(comment))
  .addChild(nga.menu(tag))
  .addChild(nga.menu(settings))
);
```

The menus appear in the order in which they were added to the main menu. The `Menu` class offers `icon()`, `title()`, and `template()` methods to customize how the menu renders.

```js
admin.menu(nga.menu()
  .addChild(nga.menu(post))
  .addChild(nga.menu(comment).title('Comments'))
  .addChild(nga.menu(tag).icon('<span class="glyphicon glyphicon-tags"></span>'))
  .addChild(nga.menu(settings).icon('<span class="glyphicon glyphicon-cog"></span>'))
);
```

You can also choose to define a menu from scratch. In this case, you should define the internal state the menu points to using `link()`, and the function to determine whether the menu is active based on the current state with `active()`.

```js
admin.menu(nga.menu()
    .addChild(nga.menu()
        .title('Stats')
        .link('/stats')
        .active(function(path) {
            return path.indexOf('/stats') === 0;
        })
    )
);
```

You can add also second-level menus.

```js
admin.menu(nga.menu()
    .addChild(nga.menu().title('Miscellaneous')
        .addChild(nga.menu().title('Stats').link('/stats'))
    )
);
```

By default parent menus will automatically close when none of their children are active. This can be deactivated with:
```js
nga.menu().autoClose(false);
```

This option is global and will affect all menu.

*Tip*: `admin.menu()` is both a setter and a getter. You can modify an existing menu in the admin configuration by using `admin.menu().getChildByTitle()`
```js
admin.addEntity(post)
admin.menu().getChildByTitle('Post')
    .title('Posts')
    .icon('<span class="glyphicon glyphicon-file"></span>');
```
