# Upgrade to 0.7

## Field factory

ng-admin 0.7 breaks compatibility with 0.5 and makes the "factories" configuration API compulsory. If your configuration uses `nga.field()`, it will still work woth 0.7. If it uses `new Field()`, you'll need to follow [the 0.6 upgrade guide](https://github.com/marmelab/ng-admin/blob/b3c7b1afc6a52651df6ba4454d8461620339b4da/UPGRADE-0.6.md).

## Configuration factory

The configuration is now done through the `AdminDescription` object. You can retrieve it directly from Angular DI.

``` diff
- app.config(function (NgAdminConfigurationProvider, RestangularProvider) {
+ app.config(function (AdminDescription, NgAdminConfigurationProvider, RestangularProvider) {
-     var nga = NgAdminConfigurationProvider;
+     var nga = AdminDescription;

      // ...

-     nga.configure(admin);
+     NgAdminConfigurationProvider.configure(admin);
  });
```

Note you still need the `NgAdminConfigurationProvider` to apply your application configuration.

During the 0.8 version, some proxy methods transmits actions from `NgAdminConfigurationProvider` to `AdminDescription`, allowing you to transition smoothly.

## Field type

Method `Field.type()` is no longer supported as a setter. Instead, you should specify the second argument from the field factory.

``` diff
- nga.field('created_at').type('date')
+ nga.field('created_at', 'date')
```

## perPage instead of limit

Dashboard view `limit()` method has been deprecated. Please use the `perPage` method instead.
