# Installation

Grab ng-admin from your favorite package manager, `npm` or `bower`:

```sh
npm install ng-admin --save
# or
bower install ng-admin --save
```

Add the `ng-admin.min.css` and `ng-admin.min.js` to the HTML, add a `<div ui-view="ng-admin"/>`, and configure the admin:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My First Admin</title>
    <link rel="stylesheet" href="node_modules/ng-admin/build/ng-admin.min.css">
  </head>
  <body ng-app="myApp">
    <div ui-view="ng-admin"></div>
    <script src="node_modules/ng-admin/build/ng-admin.min.js"></script>
    <script type="text/javascript">
    var myApp = angular.module('myApp', ['ng-admin']);
    myApp.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
        var nga = NgAdminConfigurationProvider;
        // create an admin application
        var admin = nga.application('My First Admin');
        // more configuation here later
        // ...
        // attach the admin application to the DOM and run it
        nga.configure(admin);
    }]);
    </script>
  </body>
</html>
```

You're good to go, now you can [get started](Getting-started.md) with a sample administration.

**Tip**: The minified files `ng-admin.min.js` and `ng-admin.min.css` contain all dependencies bundled into a single, convenient file. This includes Angular.js, Restangular, and many other plugins. If `ng-admin.min.js` is ideal for beginners, once you start adding third-party scripts on your own, you may want to build a custom bundle from source. Check the [Getting Ready for Production](Production.md) chapter for directions.