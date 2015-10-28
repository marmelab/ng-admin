# ngAdminConfigurationProvider

The only object that you need from ng-admin is `NgAdminConfigurationProvider` (often abbreviated `nga` in all the documentation and examples). Inject this object to the main configuration function:

```js
// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // continue here
});
```

## Factory functions

`NgAdminConfigurationProvider` is a helper that contains factory functions for all the classes you need.

```js
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // application factory function
    var admin = nga.application('My Admin Backend');
    // entity factory function
    var post = nga.entity('posts')
    // field factory function
    var name = nga.field('name')
    // menu factory function
    var menu = nga.menu();
    // dashboard factory function
    var dashboard = nga.dashboard();
});
```

## configure

`NgAdminConfigurationProvider` also provides the `configure()` method, which is the last method usually called in an admin configuration. It expects one parameter: an `Application` instance. It attaches the admin application to the DOM and runs it.

```js
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    var admin = nga.application('My First Admin');
    // more configuation here
    // ...
    nga.configure(admin);
}]);
```

## registerFieldType

Lastly, the `field()` factory provided by `NgAdminConfigurationProvider` delegates instanciation of fields to third party objects. You can override the result of a call to `nga.field(type)`, or add a new type, by calling `registerFieldType()` first.

```js
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('date', require('path/to/MyCustomDateField'))
}]);
```

See the [Custom types documentation](Custom-types.md) for more details.
