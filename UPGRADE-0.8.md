# Upgrade to 0.8

## View and Entity URL customization

Arguments for the anonymous function of the entity url customisation were changed.

``` diff
- nga.entity('comments').url(function(view, entityId) {
-     return '/comments/' + view.name() + '/' + entityId;
+ nga.entity('comments').url(function(entityName, viewType, identifierValue, identifierName) {
+     return '/comments/' + entityName + '_' + viewType + '/' + identifierValue;
```

## Field Identifier

The `Field.identifier(true)` does not exist anymore. Instead, you must specify the identifier in the associated entity.

``` diff
- nga.field('id').identifier(true)
+ entity.identifier(nga.field('id'))
```

