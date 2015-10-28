# Application Configuration

The Application object is the base of an administration. There can be only one such object defined on a page.

```js
// create an application instance
var admin = nga.application('My backend');
// configure it
// ...
// attach the application instance to the dom and run it
nga.configure(admin);
```

* `nga.application(title, debug)` (factory method)
Create a new Application instance. Debug is true by default; set it to false to speed up rendering a bit.

* `title()`
Defines the application title, displayed in the header

        var app = nga.application().title('My backend')

* `baseApiUrl()`
Defines the main API endpoint

        var app = nga.application().baseApiUrl('http://localhost:3000/')

* `debug()`
Enable or disable debug (enabled by default)

        var app = nga.application().debug(false)

* `header(string)`
Customize the application header. See [the Theming doc](../Theming.md) for details.

* `menu(Menu)`
Customize the sidebar menu. See [the Menu doc](../Menus.md) for details.

* `dashboard(Dashboard)`
Customize the dashboard, i.e. the admin home screen. See [the Dashboard doc](../Dashboard.md) for details.

* `addEntity(Entity)`
Add an entity to the application. See [Entity configuration](Entity.md).
